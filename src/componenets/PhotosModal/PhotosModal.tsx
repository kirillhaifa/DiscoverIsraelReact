import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
let classes = require('./PhotosModal.module.scss');
let themes = require('../../public/Styles/themes.module.scss');

interface Photo {
  photoWay?: string;
  photoName?: string;
}

interface PhotosModalProps {
  open: boolean;
  index: number | null; // initial index when opening
  photos: Photo[];
  onClose: () => void;
  onImageError: (idx: number) => void;
}

const PhotosModal: React.FC<PhotosModalProps> = ({ open, index, photos, onClose, onImageError }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(index ?? null);

  // sync when modal opens or parent provides a new index
  useEffect(() => {
    if (open) {
      setCurrentIndex(index ?? null);
    }
  }, [open, index]);

  // keep index valid when photos change
  useEffect(() => {
    if (currentIndex === null) return;
    if (currentIndex >= photos.length) {
      setCurrentIndex(photos.length - 1 >= 0 ? photos.length - 1 : null);
    }
  }, [photos, currentIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (photos.length === 0) return;
    setCurrentIndex(prev => {
      if (prev === null) return 0;
      return (prev - 1 + photos.length) % photos.length;
    });
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (photos.length === 0) return;
    setCurrentIndex(prev => {
      if (prev === null) return 0;
      return (prev + 1) % photos.length;
    });
  };

  // keyboard navigation inside modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, photos]);

  const current = currentIndex !== null ? photos[currentIndex] : null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={`${classes.modalBox} ${themes}`}>
        <div className={classes.modalPhotoRow}>
          {photos.length > 1 && (
            <IconButton onClick={handlePrev} size="large" className={classes.modalNavBtn}>
              <MdChevronLeft size={36} />
            </IconButton>
          )}

          <div className={classes.modalImageWrap}>
            {current && (
              <img
                src={current.photoWay}
                alt={current.photoName}
                className={classes.modalImage}
                onClick={handleNext}
                onError={() => currentIndex !== null && onImageError(currentIndex)}
              />
            )}

            <div className={classes.modalCloseWrap}>
              <IconButton onClick={onClose} size="small" className={classes.modalCloseBtn}>
                <MdClose size={20} />
              </IconButton>
            </div>
          </div>

          {photos.length > 1 && (
            <IconButton onClick={handleNext} size="large" className={classes.modalNavBtn}>
              <MdChevronRight size={36} />
            </IconButton>
          )}
        </div>

        {current && (
          <div className={classes.modalCaption}>{current.photoName}</div>
        )}
      </Box>
    </Modal>
  );
};

export default PhotosModal;
