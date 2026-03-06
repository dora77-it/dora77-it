"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./SearchForm.module.css";

export default function SearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [concept, setConcept] = useState("family");
  const [pace, setPace] = useState("relaxed");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

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
    <div className={styles.formContainer}>
      <form onSubmit={onSubmit} className={styles.searchForm}>
        <div className={styles.formHeader}>
          <h2>여행 일정 생성</h2>
          <p>원하는 여행지와 날짜를 입력하세요</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="destination">여행지</label>
            <input
              id="destination"
              type="text"
              placeholder="예: 도쿄, 서울"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">출발일</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">귀국일</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.selectGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="concept">여행 컨셉</label>
            <select
              id="concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className={styles.select}
            >
              <option value="family">가족 여행</option>
              <option value="couple">커플 여행</option>
              <option value="friends">친구 여행</option>
              <option value="solo">혼자 여행</option>
              <option value="adventure">모험 여행</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pace">여행 속도</label>
            <select
              id="pace"
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              className={styles.select}
            >
              <option value="relaxed">느긋하게</option>
              <option value="moderate">적당히</option>
              <option value="busy">활동적으로</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "생성 중..." : "AI 일정 생성"}
        </button>
      </form>
    </div>
  );
}
