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
};

type Mapel = {
  id: string;
  namaMapel: string;
};

type Nilai = {
  id: string;
  siswaId: string;
  siswaNama: string;
  mapelId: string;
  mapelNama: string;
  tugas: number;
  uts: number;
  uas: number;
  nilaiAkhir: number;
};

export default function NilaiPage() {
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [dataMapel, setDataMapel] = useState<Mapel[]>([]);
  const [dataNilai, setDataNilai] = useState<Nilai[]>([]);

  const [siswaId, setSiswaId] = useState("");
  const [mapelId, setMapelId] = useState("");
  const [tugas, setTugas] = useState("");
  const [uts, setUts] = useState("");
  const [uas, setUas] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const ambilDataAwal = async () => {
    try {
      const siswaSnapshot = await getDocs(collection(db, "siswa"));
      const mapelSnapshot = await getDocs(collection(db, "mapel"));
      const nilaiSnapshot = await getDocs(collection(db, "nilai"));

      const siswaList: Siswa[] = siswaSnapshot.docs.map((docItem) => ({
        id: docItem.id,
        nama: docItem.data().nama,
      }));

      const mapelList: Mapel[] = mapelSnapshot.docs.map((docItem) => ({
        id: docItem.id,
        namaMapel: docItem.data().namaMapel,
      }));

      const nilaiList: Nilai[] = nilaiSnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Nilai, "id">),
      }));

      setDataSiswa(siswaList);
      setDataMapel(mapelList);
      setDataNilai(nilaiList);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    ambilDataAwal();
  }, []);

  const resetForm = () => {
    setSiswaId("");
    setMapelId("");
    setTugas("");
    setUts("");
    setUas("");
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    try {
      const siswaDipilih = dataSiswa.find((item) => item.id === siswaId);
      const mapelDipilih = dataMapel.find((item) => item.id === mapelId);

      if (!siswaDipilih || !mapelDipilih) {
        setPesan("Siswa atau mata pelajaran belum dipilih.");
        setLoading(false);
        return;
      }

      const nilaiTugas = Number(tugas);
      const nilaiUts = Number(uts);
      const nilaiUas = Number(uas);
      const nilaiAkhir = (nilaiTugas + nilaiUts + nilaiUas) / 3;

      if (editId) {
        await updateDoc(doc(db, "nilai", editId), {
          siswaId,
          siswaNama: siswaDipilih.nama,
          mapelId,
          mapelNama: mapelDipilih.namaMapel,
          tugas: nilaiTugas,
          uts: nilaiUts,
          uas: nilaiUas,
          nilaiAkhir,
        });
        setPesan("Data nilai berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "nilai"), {
          siswaId,
          siswaNama: siswaDipilih.nama,
          mapelId,
          mapelNama: mapelDipilih.namaMapel,
          tugas: nilaiTugas,
          uts: nilaiUts,
          uas: nilaiUas,
          nilaiAkhir,
          createdAt: new Date(),
        });
        setPesan("Data nilai berhasil disimpan.");
      }

      resetForm();
      ambilDataAwal();
    } catch (error) {
      setPesan("Gagal menyimpan data nilai.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Nilai) => {
    setSiswaId(item.siswaId);
    setMapelId(item.mapelId);
    setTugas(String(item.tugas));
    setUts(String(item.uts));
    setUas(String(item.uas));
    setEditId(item.id);
    setPesan("Mode edit aktif.");
  };

  const handleHapus = async (id: string) => {
    const yakin = confirm("Yakin ingin menghapus data nilai ini?");
    if (!yakin) return;

    try {
      await deleteDoc(doc(db, "nilai", id));
      setPesan("Data nilai berhasil dihapus.");

      if (editId === id) {
        resetForm();
      }

      ambilDataAwal();
    } catch (error) {
      setPesan("Gagal menghapus data nilai.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen  bg-[#0b1120] p-6 text-black">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="mb-2 text-3xl font-bold">Input Nilai</h1>
          <p className="mb-6 text-slate-600">
            Tambah, edit, dan hapus nilai siswa berdasarkan mata pelajaran.
          </p>

          {pesan ? (
            <div className="mb-4 rounded-lg bg-slate-100 px-4 py-3 text-sm">
              {pesan}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Pilih Siswa</label>
              <select
                value={siswaId}
                onChange={(e) => setSiswaId(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                required
              >
                <option value="">-- Pilih Siswa --</option>
                {dataSiswa.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Pilih Mata Pelajaran
              </label>
              <select
                value={mapelId}
                onChange={(e) => setMapelId(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                required
              >
                <option value="">-- Pilih Mata Pelajaran --</option>
                {dataMapel.map((mapel) => (
                  <option key={mapel.id} value={mapel.id}>
                    {mapel.namaMapel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nilai Tugas</label>
              <input
                type="number"
                value={tugas}
                onChange={(e) => setTugas(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Masukkan nilai tugas"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nilai UTS</label>
              <input
                type="number"
                value={uts}
                onChange={(e) => setUts(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Masukkan nilai UTS"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nilai UAS</label>
              <input
                type="number"
                value={uas}
                onChange={(e) => setUas(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Masukkan nilai UAS"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : editId ? "Update Nilai" : "Simpan Nilai"}
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
          <h2 className="mb-4 text-2xl font-bold">Daftar Nilai</h2>

          {dataNilai.length === 0 ? (
            <p className="text-slate-500">Belum ada data nilai.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-2 text-left">No</th>
                    <th className="px-4 py-2 text-left">Siswa</th>
                    <th className="px-4 py-2 text-left">Mapel</th>
                    <th className="px-4 py-2 text-left">Tugas</th>
                    <th className="px-4 py-2 text-left">UTS</th>
                    <th className="px-4 py-2 text-left">UAS</th>
                    <th className="px-4 py-2 text-left">Nilai Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {dataNilai.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{item.siswaNama}</td>
                      <td className="px-4 py-2 border">{item.mapelNama}</td>
                      <td className="px-4 py-2 border">{item.tugas}</td>
                      <td className="px-4 py-2 border">{item.uts}</td>
                      <td className="px-4 py-2 border">{item.uas}</td>
                      <td className="px-4 py-2 border">{item.nilaiAkhir.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleHapus(item.id)}
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
            <Link href="/dashboard" className="inline-block rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700">
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}