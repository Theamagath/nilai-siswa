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

type Siswa = {
  id: string;
  nama: string;
  nisn: string;
  kelas: string;
};

export default function DataSiswaPage() {
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");
  const [kelas, setKelas] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const ambilDataSiswa = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "siswa"));
      const hasil: Siswa[] = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Siswa, "id">),
      }));
      setDataSiswa(hasil);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
    }
  };

  useEffect(() => {
    ambilDataSiswa();
  }, []);

  const resetForm = () => {
    setNama("");
    setNisn("");
    setKelas("");
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    try {
      if (editId) {
        await updateDoc(doc(db, "siswa", editId), {
          nama,
          nisn,
          kelas,
        });
        setPesan("Data siswa berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "siswa"), {
          nama,
          nisn,
          kelas,
          createdAt: new Date(),
        });
        setPesan("Data siswa berhasil disimpan.");
      }

      resetForm();
      ambilDataSiswa();
    } catch (error) {
      setPesan("Terjadi kesalahan saat menyimpan data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (siswa: Siswa) => {
    setNama(siswa.nama);
    setNisn(siswa.nisn);
    setKelas(siswa.kelas);
    setEditId(siswa.id);
    setPesan("Mode edit aktif.");
  };

  const handleHapus = async (id: string) => {
    const yakin = confirm("Yakin ingin menghapus data siswa ini?");
    if (!yakin) return;

    try {
      await deleteDoc(doc(db, "siswa", id));
      setPesan("Data siswa berhasil dihapus.");
      ambilDataSiswa();

      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      setPesan("Gagal menghapus data siswa.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-6 text-black">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="mb-2 text-3xl font-bold">Data Siswa</h1>
          <p className="mb-6 text-slate-600">
            Tambah, edit, hapus, dan lihat data siswa dari Firebase Firestore.
          </p>

          {pesan ? (
            <div className="mb-4 rounded-lg bg-slate-100 px-4 py-3 text-sm">
              {pesan}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nama Siswa</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Masukkan nama siswa"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">NISN</label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Masukkan NISN"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Kelas</label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Contoh: 10-A"
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
          <h2 className="mb-4 text-2xl font-bold">Daftar Siswa</h2>

          {dataSiswa.length === 0 ? (
            <p className="text-slate-500">Belum ada data siswa.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border px-4 py-2 text-left">No</th>
                    <th className="border px-4 py-2 text-left">Nama</th>
                    <th className="border px-4 py-2 text-left">NISN</th>
                    <th className="border px-4 py-2 text-left">Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSiswa.map((siswa, index) => (
                    <tr key={siswa.id}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{siswa.nama}</td>
                      <td className="border px-4 py-2">{siswa.nisn}</td>
                      <td className="border px-4 py-2">{siswa.kelas}</td>
                      <td className=" px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(siswa)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleHapus(siswa.id)}
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