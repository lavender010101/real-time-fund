'use client';

import { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from './Icons';

/**
 * 统一风格的拟玻璃态日期选择器
 * - 外观与 GlassSelect 保持一致
 * - 使用自定义日历面板，而不是浏览器默认的 date picker 样式
 */

function parseDateString(str) {
  if (!str) return null;
  const parts = str.split('-').map((n) => Number(n));
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function GlassDatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  disabled = false,
  className = '',
}) {
  const selectedDate = parseDateString(value);
  const now = new Date();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    selectedDate ? selectedDate.getFullYear() : now.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate ? selectedDate.getMonth() : now.getMonth(),
  ); // 0-11

  const wrapperRef = useRef(null);

  // 点击外部收起
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 外部值变化时，同步视图月份
  useEffect(() => {
    const d = parseDateString(value);
    if (!d) return;
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  const handleSelectDay = (day) => {
    if (disabled) return;
    const d = new Date(viewYear, viewMonth, day);
    const formatted = formatDate(d);
    onChange?.(formatted);
    setOpen(false);
  };

  const handleToggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const changeMonth = (delta) => {
    let y = viewYear;
    let m = viewMonth + delta;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  };

  const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0-6
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(d);
  }

  const today = new Date();

  const displayText = selectedDate ? formatDate(selectedDate) : placeholder;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <button
        type="button"
        onClick={handleToggleOpen}
        disabled={disabled}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          width: '100%',
          height: 44,
          padding: '0 14px',
          borderRadius: 12,
          border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
          background: '#0b1220',
          color: 'var(--text)',
          fontSize: 13,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          opacity: disabled ? 0.6 : 1,
          boxShadow: open ? '0 0 0 3px rgba(96,165,250,0.2)' : 'none',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: selectedDate ? 'var(--text)' : 'var(--muted)',
          }}
        >
          {displayText}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid var(--border)',
          }}
        >
          <CalendarIcon width={14} height={14} />
        </span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: 240,
            padding: 10,
            borderRadius: 14,
            background: 'rgba(15,23,42,0.98)',
            border: '1px solid var(--border)',
            boxShadow: '0 18px 45px rgba(15,23,42,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 60,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
              fontSize: 12,
              color: 'var(--muted)',
            }}
          >
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              ‹
            </button>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>
              {viewYear}年 {viewMonth + 1}月
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 4,
              fontSize: 11,
              marginBottom: 4,
              color: 'var(--muted)',
            }}
          >
            {daysOfWeek.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: 'center',
                  padding: '2px 0',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 4,
              fontSize: 12,
            }}
          >
            {cells.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} />;
              }
              const cellDate = new Date(viewYear, viewMonth, day);
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === cellDate.getFullYear() &&
                selectedDate.getMonth() === cellDate.getMonth() &&
                selectedDate.getDate() === cellDate.getDate();
              const isToday =
                today.getFullYear() === cellDate.getFullYear() &&
                today.getMonth() === cellDate.getMonth() &&
                today.getDate() === cellDate.getDate();

              let bg = 'transparent';
              let color = 'var(--text)';
              let border = '1px solid transparent';

              if (isSelected) {
                bg = 'var(--primary)';
                color = '#05263b';
              } else if (isToday) {
                border = '1px solid var(--accent)';
              } else {
                color = 'var(--muted)';
              }

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  style={{
                    width: '100%',
                    padding: '4px 0',
                    borderRadius: 999,
                    border,
                    background: bg,
                    color,
                    cursor: 'pointer',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

