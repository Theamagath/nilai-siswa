"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type Mapel = {
  id: string;
  namaMapel: string;
  kodeMapel: string;
  kkm: string;
};

export default function DataMapelPage() {
  const [namaMapel, setNamaMapel] = useState("");
  const [kodeMapel, setKodeMapel] = useState("");
  const [kkm, setKkm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [dataMapel, setDataMapel] = useState<Mapel[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const ambilDataMapel = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mapel"));
      const hasil: Mapel[] = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Mapel, "id">),
      }));
      setDataMapel(hasil);
    } catch (error) {
      console.error("Gagal mengambil data mapel:", error);
    }
  };

  useEffect(() => {
    ambilDataMapel();
  }, []);

  const resetForm = () => {
    setNamaMapel("");
    setKodeMapel("");
    setKkm("");
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    try {
      if (editId) {
        await updateDoc(doc(db, "mapel", editId), {
          namaMapel,
          kodeMapel,
          kkm,
        });
        setPesan("Data mata pelajaran berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "mapel"), {
          namaMapel,
          kodeMapel,
          kkm,
          createdAt: new Date(),
        });
        setPesan("Data mata pelajaran berhasil disimpan.");
      }

      resetForm();
      ambilDataMapel();
    } catch (error) {
      setPesan("Terjadi kesalahan saat menyimpan data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mapel: Mapel) => {
    setNamaMapel(mapel.namaMapel);
    setKodeMapel(mapel.kodeMapel);
    setKkm(mapel.kkm);
    setEditId(mapel.id);
    setPesan("Mode edit aktif.");
  };

  const handleHapus = async (id: string) => {
    const yakin = confirm("Yakin ingin menghapus data mata pelajaran ini?");
    if (!yakin) return;

    try {
      await deleteDoc(doc(db, "mapel", id));
      setPesan("Data mata pelajaran berhasil dihapus.");
      ambilDataMapel();

      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      setPesan("Gagal menghapus data mata pelajaran.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="mb-2 text-3xl font-bold">Data Mata Pelajaran</h1>
          <p className="mb-6 text-slate-600">
            Tambah, edit, hapus, dan lihat data m ata pelajaran.
          </p>

          {pesan ? (
            <div className="mb-4 rounded-lg bg-slate-100 px-4 py-3 text-sm">
              {pesan}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Nama Mata Pelajaran
              </label>
              <input
                type="text"
                value={namaMapel}
                onChange={(e) => setNamaMapel(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Contoh: Matematika"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Kode Mata Pelajaran
              </label>
              <input
                type="text"
                value={kodeMapel}
                onChange={(e) => setKodeMapel(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Contoh: MTK01"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">KKM</label>
              <input
                type="text"
                value={kkm}
                onChange={(e) => setKkm(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Contoh: 75"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : editId ? "Update" : "Simpan"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Daftar Mata Pelajaran</h2>

          {dataMapel.length === 0 ? (
            <p className="text-slate-500">Belum ada data mata pelajaran.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-2 text-left border">No</th>
                    <th className="px-4 py-2 text-left border">Nama Mapel</th>
                    <th className="px-4 py-2 text-left border">Kode</th>
                    <th className="px-4 py-2 text-left border">KKM</th>
                  </tr>
                </thead>
                <tbody>
                  {dataMapel.map((mapel, index) => (
                    <tr key={mapel.id}>
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{mapel.namaMapel}</td>
                      <td className="px-4 py-2 border">{mapel.kodeMapel}</td>
                      <td className="px-4 py-2 border">{mapel.kkm}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(mapel)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleHapus(mapel.id)}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6">
            <Link href="/dashboard" className="text-blue-600">
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}