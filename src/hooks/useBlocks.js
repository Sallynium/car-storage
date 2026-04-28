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

export function useBlocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'blocks'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setBlocks(data);
      setLoading(false);
    }, (err) => {
      console.error('Firestore error:', err);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const floorBlocks = blocks
    .filter(b => b.area === 'floor')
    .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));

  const wallBlocks = blocks
    .filter(b => b.area === 'wall')
    .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));

  const addBlock = async (area) => {
    const color = COLORS[blocks.length % COLORS.length];
    const base = {
      area,
      color,
      items: [],
      createdAt: serverTimestamp(),
    };
    const extra = area === 'floor'
      ? { x: 20 + (blocks.filter(b => b.area === 'floor').length * 10) % 100, y: 20 + (blocks.filter(b => b.area === 'floor').length * 10) % 80, width: 160, height: 110 }
      : { height: 120 };
    await addDoc(collection(db, 'blocks'), { ...base, ...extra });
  };

  const updateBlock = async (id, data) => {
    await updateDoc(doc(db, 'blocks', id), data);
  };

  const deleteBlock = async (id) => {
    await deleteDoc(doc(db, 'blocks', id));
  };

  return { floorBlocks, wallBlocks, loading, addBlock, updateBlock, deleteBlock };
}
