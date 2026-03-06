"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [concept, setConcept] = useState("family");
  const [pace, setPace] = useState("relaxed");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams({
      destination,
      startDate,
      endDate,
      concept,
      pace,
    });

    router.push(`/itinerary?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 border p-4 rounded">
      <div>
        <label className="block mb-1 text-sm">여행지</label>
        <input
          className="w-full border px-2 py-1 rounded"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Tokyo, Paris, 제주..."
          required
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 text-sm">출발일</label>
          <input
            type="date"
            className="w-full border px-2 py-1 rounded"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
          />
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm">도착일</label>
          <input
            type="date"
            className="w-full border px-2 py-1 rounded"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 text-sm">컨셉</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
          >
            <option value="family">가족</option>
            <option value="friends">친구</option>
            <option value="couple">커플</option>
            <option value="solo">혼자</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm">이동 스타일</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={pace}
            onChange={(event) => setPace(event.target.value)}
          >
            <option value="relaxed">여유 있게</option>
            <option value="normal">보통</option>
            <option value="busy">빡세게</option>
          </select>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium">
        여행 일정 만들기
      </button>
    </form>
  );
}
