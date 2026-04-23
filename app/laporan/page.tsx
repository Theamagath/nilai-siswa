"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

type Nilai = {
  id: string;
  siswaNama: string;
  mapelNama: string;
  tugas: number;
  uts: number;
  uas: number;
  nilaiAkhir: number;
};

export default function LaporanPage() {
  const [dataNilai, setDataNilai] = useState<Nilai[]>([]);

  const ambilDataLaporan = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "nilai"));
      const hasil: Nilai[] = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Nilai, "id">),
      }));
      setDataNilai(hasil);
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    }
  };

  useEffect(() => {
    ambilDataLaporan();
  }, []);

  return (
    <div className="min-h-screen  bg-[#0b1120] p-6 text-black">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="mb-2 text-3xl font-bold">Laporan Nilai</h1>
          <p className="text-slate-600">
            Rekap nilai siswa berdasarkan data yang sudah diinput.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Daftar Laporan</h2>

          {dataNilai.length === 0 ? (
            <p className="text-slate-500">Belum ada data laporan nilai.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-2 text-left">No</th>
                    <th className="px-4 py-2 text-left">Nama Siswa</th>
                    <th className="px-4 py-2 text-left">Mata Pelajaran</th>
                    <th className="px-4 py-2 text-left">Tugas</th>
                    <th className="px-4 py-2 text-left">UTS</th>
                    <th className="px-4 py-2 text-left">UAS</th>
                    <th className="px-4 py-2 text-left">Nilai Akhir</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataNilai.map((item, index) => {
                    const status =
                      item.nilaiAkhir >= 75 ? "Tuntas" : "Belum Tuntas";

                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{item.siswaNama}</td>
                        <td className="px-4 py-2 border">{item.mapelNama}</td>
                        <td className="px-4 py-2 border">{item.tugas}</td>
                        <td className="px-4 py-2 border">{item.uts}</td>
                        <td className="px-4 py-2 border">{item.uas}</td>
                        <td className="px-4 py-2 border">
                          {item.nilaiAkhir.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border">
                          <span
                            className={`rounded px-3 py-1 text-sm text-white ${
                              status === "Tuntas"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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