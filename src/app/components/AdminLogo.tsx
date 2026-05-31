import React from 'react';
import { AdminIcon } from './AdminIcon';

export const AdminLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <AdminIcon />
    <div style={{ display: 'flex', gap: '4px' }}>
      <span style={{ fontFamily: "Space Grotesk, sans-serif", color: "#e8192c", fontWeight: 700, fontSize: "22px", letterSpacing: "3px" }}>HAKAI</span>
      <span style={{ fontFamily: "Space Grotesk, sans-serif", color: "#111111", fontWeight: 600, fontSize: "22px", letterSpacing: "3px" }}> MOTIVES</span>
    </div>
  </div>
);
