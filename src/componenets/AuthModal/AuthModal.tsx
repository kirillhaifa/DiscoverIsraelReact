import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeAuthPrompt } from '../../store/authPrompt/authPromptSlice';
import { selectAuthPromptOpen, selectAuthPromptReason } from '../../store/authPrompt/authPromptSelectors';
import Login from '../Login/Login';
import { translations } from '../../public/translations';
import { RootState } from '../../store';
let classes = require('./AuthModal.module.scss');

const AuthModal: React.FC = () => {
  const open = useSelector(selectAuthPromptOpen);
  const reason = useSelector(selectAuthPromptReason);
  const language = useSelector((state: RootState) => state.language.language);
  const dispatch = useDispatch();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeAuthPrompt());
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      // lock scroll
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('button, [role="button"], input')?.focus(), 60);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, dispatch]);

  if (!open) return null;

  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;
  const reasonMap: Record<string, string> = {
    rate: t('googleLogin'),
    unvisitedFilter: t('unvisitedOnly'),
  };

  return createPortal(
    <div className={classes.backdrop} role="dialog" aria-modal="true" onMouseDown={(e) => {
      if (e.target === e.currentTarget) dispatch(closeAuthPrompt());
    }}>
      <div className={classes.dialog} ref={dialogRef}>
        <div className={classes.header}>
          <span>{t('login')}</span>
          <button className={classes.closeBtn} aria-label="Close" onClick={() => dispatch(closeAuthPrompt())}>×</button>
        </div>
        <div className={classes.content}>
          {reason && <div className={classes.reasonNote}>{reasonMap[reason] || ''}</div>}
          <Login variant="modal" />
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};

export default AuthModal;
