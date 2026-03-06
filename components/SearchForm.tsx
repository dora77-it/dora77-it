"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3박 4일");
  const [concept, setConcept] = useState("family");
  const [pace, setPace] = useState("relaxed");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams({
      destination,
      days,
      concept,
      pace,
    });

    router.push(`/itinerary?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="planner-form">
      <div className="form-row">
        <label>
          여행지 입력
          <input
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="도시, 국가, 지역명"
            required
          />
        </label>

        <label>
          여행 일수
          <select value={days} onChange={(event) => setDays(event.target.value)}>
            <option>2박 3일</option>
            <option>3박 4일</option>
            <option>4박 5일</option>
            <option>5박 6일</option>
          </select>
        </label>

        <label>
          여행 컨셉
          <select value={concept} onChange={(event) => setConcept(event.target.value)}>
            <option value="family">가족 여행</option>
            <option value="friends">친구 여행</option>
            <option value="couple">커플 여행</option>
            <option value="solo">혼자 여행</option>
          </select>
        </label>

        <label>
          이동 스타일
          <select value={pace} onChange={(event) => setPace(event.target.value)}>
            <option value="relaxed">여유롭게</option>
            <option value="normal">보통</option>
            <option value="busy">빽빽하게</option>
          </select>
        </label>
      </div>
      <button type="submit">✨ AI 여행 일정 만들기</button>
    </form>
  );
}
