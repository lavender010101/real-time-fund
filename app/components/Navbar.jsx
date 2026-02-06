'use client';

import { useEffect, useState } from 'react';
import { ListIcon, RefreshIcon, SettingsIcon } from './Icons';
import githubImg from "../assets/github.svg";
import { supabase } from "../lib/supabase";

function MobileUserInfo({ onOpenAuth }) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email || '';
      setUserEmail(email);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email || '';
      setUserEmail(email);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!userEmail) {
    return null;
  }

  const shortName = userEmail.split('@')[0] || '用户';

  return (
    <div className="navbar-mobile-account">
      <span className="muted">当前账号</span>
      <strong>{shortName}</strong>
    </div>
  );
}

export default function Navbar({
  refreshMs,
  refreshing,
  hasFunds,
  onManualRefresh,
  onOpenSettings,
  syncStatus,
  onOpenAuth,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 窗口从小屏恢复到大屏时自动关闭菜单，避免状态残留
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleOpenGithub = () => {
    window.open("https://github.com/LiangGame/real-time-fund");
  };

  const refreshBadge = (
    <div className="badge" title="当前刷新频率">
      <span>刷新</span>
      <strong>{Math.round(refreshMs / 1000)}秒</strong>
    </div>
  );

  const refreshButton = (
    <button
      className="icon-button"
      aria-label="立即刷新"
      onClick={onManualRefresh}
      disabled={refreshing || !hasFunds}
      aria-busy={refreshing}
      title="立即刷新"
    >
      <RefreshIcon className={refreshing ? 'spin' : ''} width="18" height="18" />
    </button>
  );

  const settingsButton = (
    <button
      className="icon-button"
      aria-label="打开设置"
      onClick={onOpenSettings}
      title="设置"
    >
      <SettingsIcon width="18" height="18" />
    </button>
  );

  return (
    <div className="navbar glass">
      {refreshing && <div className="loading-bar"></div>}
      <div className="brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2" />
          <path d="M5 14c2-4 7-6 14-5" stroke="var(--primary)" strokeWidth="2" />
        </svg>
        <span>基估宝</span>
      </div>

      {/* 桌面端：保持原有布局 */}
      <div className="actions navbar-actions-desktop">
        {syncStatus && (
          <div style={{ marginRight: '8px' }}>
            {syncStatus}
          </div>
        )}
        <img
          alt="项目Github地址"
          src={githubImg.src}
          style={{ width: '30px', height: '30px', cursor: 'pointer' }}
          onClick={handleOpenGithub}
        />
        {refreshBadge}
        {refreshButton}
        {settingsButton}
      </div>

      {/* 移动端：右侧菜单按钮 + 全屏高抽屉式弹出层 */}
      <div className="navbar-actions-mobile">
        <button
          className="icon-button"
          aria-label="打开菜单"
          aria-expanded={mobileMenuOpen}
          onClick={handleToggleMobileMenu}
        >
          <ListIcon width="18" height="18" />
        </button>

        {mobileMenuOpen && (
          <div className="navbar-mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="navbar-mobile-drawer glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="navbar-mobile-main">
                {syncStatus && (
                  <div className="navbar-mobile-sync">
                    {syncStatus}
                  </div>
                )}
                <button
                  className="navbar-mobile-item"
                  type="button"
                  onClick={handleOpenGithub}
                >
                  <img
                    alt="项目Github地址"
                    src={githubImg.src}
                    style={{ width: '24px', height: '24px' }}
                  />
                  <span>项目 Github</span>
                </button>
                <div className="navbar-mobile-item navbar-mobile-badge">
                  {refreshBadge}
                </div>
                <button
                  className="navbar-mobile-item"
                  type="button"
                  onClick={onManualRefresh}
                  disabled={refreshing || !hasFunds}
                >
                  <RefreshIcon
                    className={refreshing ? 'spin' : ''}
                    width="18"
                    height="18"
                  />
                  <span>{refreshing ? '刷新中…' : '立即刷新'}</span>
                </button>
                <button
                  className="navbar-mobile-item"
                  type="button"
                  onClick={onOpenSettings}
                >
                  <SettingsIcon width="18" height="18" />
                  <span>设置</span>
                </button>
              </div>
              <MobileUserInfo onOpenAuth={onOpenAuth} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


