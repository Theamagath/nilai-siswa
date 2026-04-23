"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function DashboardPage() {
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalMapel, setTotalMapel] = useState(0);
  const [totalNilai, setTotalNilai] = useState(0);
  const [totalLaporan, setTotalLaporan] = useState(0);

  const ambilStatistik = async () => {
    try {
      const siswaSnapshot = await getDocs(collection(db, "siswa"));
      const mapelSnapshot = await getDocs(collection(db, "mapel"));
      const nilaiSnapshot = await getDocs(collection(db, "nilai"));

      setTotalSiswa(siswaSnapshot.size);
      setTotalMapel(mapelSnapshot.size);
      setTotalNilai(nilaiSnapshot.size);
      setTotalLaporan(nilaiSnapshot.size);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  };

  useEffect(() => {
    ambilStatistik();
  }, []);

  const menu = [
    {
      title: "Data Siswa",
      desc: "Kelola daftar siswa, tambah, edit, dan hapus data siswa.",
      href: "/data-siswa",
    },
    {
      title: "Data Mata Pelajaran",
      desc: "Kelola mata pelajaran dan informasi penilaian.",
      href: "/datamapel",
    },
    {
      title: "Input Nilai",
      desc: "Masukkan nilai tugas, UTS, dan UAS siswa.",
      href: "/nilai",
    },
    {
      title: "Laporan",
      desc: "Lihat rekap nilai dan hasil akhir siswa.",
      href: "/laporan",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120]">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard Sistem Nilai Siswa
          </h1>
          <p className="mt-2 text-slate-500">
            Halaman utama untuk mengelola data siswa, mata pelajaran, nilai, dan laporan.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Total Siswa</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">{totalSiswa}</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Mata Pelajaran</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">{totalMapel}</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Nilai Masuk</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">{totalNilai}</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Laporan</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">{totalLaporan}</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl bg-white p-6 shadow transition hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-slate-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.desc}
              </p>
              <p className="mt-4 text-sm font-medium text-blue-600">
                Buka halaman →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}