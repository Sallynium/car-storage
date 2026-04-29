import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLORS = [
  '#FEF9C3', '#DCFCE7', '#F3E8FF', '#FFE4E6',
  '#E0F2FE', '#FFEDD5', '#F0FDFA', '#F5F5F4',
  '#FFEDFA', '#ECFCCB',
];

export function useContainers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to both old 'blocks' collection and new 'containers' collection
    let blocksData = [];
    let containersData = [];

    const mergeAndSet = () => {
      const merged = [
        ...blocksData.map(b => ({
          ...b,
          // Migrate legacy 'area' field to 'view'
          view: b.view ?? (b.area === 'floor' ? 'floor' : 'floor'),
          w: b.w ?? b.width ?? 140,
          h: b.h ?? b.height ?? 100,
          layer: b.layer ?? 1,
          parentId: b.parentId ?? null,
          isStoredInside: b.isStoredInside ?? false,
          compartments: b.compartments ?? [],
          name: b.name ?? '',
          type: b.type ?? 'other',
          _collection: 'blocks',
        })),
        ...containersData,
      ];
      merged.sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));
      setContainers(merged);
      setLoading(false);
    };

    const unsubBlocks = onSnapshot(collection(db, 'blocks'), (snapshot) => {
      blocksData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      mergeAndSet();
    }, (err) => {
      console.error('Firestore blocks error:', err);
      setLoading(false);
    });

    const unsubContainers = onSnapshot(collection(db, 'containers'), (snapshot) => {
      containersData = snapshot.docs.map(d => ({ id: d.id, ...d.data(), _collection: 'containers' }));
      mergeAndSet();
    }, (err) => {
      console.error('Firestore containers error:', err);
    });

    return () => {
      unsubBlocks();
      unsubContainers();
    };
  }, []);

  // View-based filters
  const containersByView = (view) => containers.filter(c => c.view === view);
  const visibleContainers = (view) => containersByView(view).filter(c => !c.isStoredInside);
  const childrenOf = (parentId) => containers.filter(c => c.parentId === parentId);

  // Legacy floor/wall accessors (keeps existing components working)
  const floorBlocks = containers
    .filter(c => (c.view === 'floor' || c.area === 'floor') && !c.isStoredInside)
    .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));

  const addContainer = async (view = 'floor', overrides = {}) => {
    const same = containers.filter(c => c.view === view);
    const color = COLORS[same.length % COLORS.length];
    const newDoc = {
      name: '',
      type: 'other',
      view,
      x: 20 + (same.length * 10) % 100,
      y: 20 + (same.length * 10) % 80,
      w: 160,
      h: 110,
      layer: 1,
      parentId: null,
      isStoredInside: false,
      compartments: [],
      color,
      createdAt: serverTimestamp(),
      ...overrides,
    };
    await addDoc(collection(db, 'containers'), newDoc);
  };

  // addBlock kept for backward-compat with existing VehicleLayout
  const addBlock = async (area) => {
    await addContainer(area === 'floor' ? 'floor' : 'floor');
  };

  const updateContainer = async (id, data, collectionName = 'containers') => {
    // Determine which collection this doc lives in
    const existing = containers.find(c => c.id === id);
    const col = existing?._collection ?? collectionName;
    await updateDoc(doc(db, col, id), data);
  };

  // Alias for backward-compat
  const updateBlock = (id, data) => updateContainer(id, data);

  const deleteContainer = async (id) => {
    const existing = containers.find(c => c.id === id);
    const col = existing?._collection ?? 'containers';
    await deleteDoc(doc(db, col, id));
  };

  const deleteBlock = deleteContainer;

  return {
    containers,
    loading,
    containersByView,
    visibleContainers,
    childrenOf,
    // Legacy
    floorBlocks,
    wallBlocks: [],
    addContainer,
    addBlock,
    updateContainer,
    updateBlock,
    deleteContainer,
    deleteBlock,
  };
}
