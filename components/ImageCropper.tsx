'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * ImageCropper PRO (v9)
 *  - aspect: number (1 for 1:1, 4/3 for 4:3)
 *  - minWidth, minHeight: minimum natural image dimensions
 *  - onCropped(dataURL)
 *  - initialImageUrl?: string
 *  - label?: string
 *  - allowCamera?: boolean
 *  - maxMB?: number
 *  - quality?: number (JPEG quality)
 *  - watermark?: { enabledByDefault?: boolean; logoUrl?: string; opacity?: number; scale?: number; margin?: number; corner?: 'br'|'bl'|'tr'|'tl' }
 */
export default function ImageCropper({
  aspect = 1,
  onCropped,
  initialImageUrl,
  label = 'Imagen (subir y recortar)',
  allowCamera = true,
  maxMB = 2,
  quality = 0.8,
  minWidth = 400,
  minHeight = 400,
  watermark
}: {
  aspect?: number;
  onCropped: (dataUrl: string) => void;
  initialImageUrl?: string;
  label?: string;
  allowCamera?: boolean;
  maxMB?: number;
  quality?: number;
  minWidth?: number;
  minHeight?: number;
  watermark?: { enabledByDefault?: boolean; logoUrl?: string; opacity?: number; scale?: number; margin?: number; corner?: 'br'|'bl'|'tr'|'tl' };
}){
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [touchDist, setTouchDist] = useState<number | null>(null);
  const [origin, setOrigin] = useState<{x:number;y:number}>({x:0,y:0});
  const [imgDraw, setImgDraw] = useState<{w:number;h:number}>({w:0,h:0});
  const [wmEnabled, setWmEnabled] = useState<boolean>(!!watermark?.enabledByDefault);
  const [wmLogo, setWmLogo] = useState<HTMLImageElement | null>(null);
  const [showBigPreview, setShowBigPreview] = useState(false);

  const viewW = 600;
  const viewH = 400;
  const cropW = Math.min(viewW*0.9, aspect >= 1 ? Math.min(viewW*0.9, (viewH*0.9)*aspect) : viewW*0.9);
  const cropH = cropW / aspect;
  const cropX = (viewW - cropW)/2;
  const cropY = (viewH - cropH)/2;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if (initialImageUrl) {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => {
        if (im.naturalWidth < minWidth || im.naturalHeight < minHeight){
          setMessage(`La imagen es muy pequeña (${im.naturalWidth}x${im.naturalHeight}). Mínimo ${minWidth}x${minHeight}px.`);
        }
        setImg(im);
        const baseZoom = computeBaseZoom(im);
        setZoom(baseZoom);
        const iw = im.width * baseZoom, ih = im.height * baseZoom;
        setImgDraw({w: iw, h: ih});
        setOrigin({ x: (viewW - iw)/2, y: (viewH - ih)/2 });
      };
      im.src = initialImageUrl;
    }
    if (watermark?.logoUrl){
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      logo.onload = () => setWmLogo(logo);
      logo.src = watermark.logoUrl;
    }
  }, [initialImageUrl]);

  useEffect(()=>{ draw(); }, [img, zoom, origin, wmEnabled]);

  function computeBaseZoom(im: HTMLImageElement){
    const zw = viewW / im.width;
    const zh = viewH / im.height;
    return Math.min(zw, zh);
  }
  function ensureWithinBounds(nx:number, ny:number, iw:number, ih:number){
    const minX = cropX + cropW - iw;
    const maxX = cropX;
    const minY = cropY + cropH - ih;
    const maxY = cropY;
    return {
      x: Math.max(minX, Math.min(maxX, nx)),
      y: Math.max(minY, Math.min(maxY, ny)),
    };
  }

  const draw = () => {
    const c = canvasRef.current;
    const p = previewRef.current;
    if (!c || !p) return;
    const ctx = c.getContext('2d')!;
    const pctx = p.getContext('2d')!;
    ctx.clearRect(0,0,viewW,viewH);
    ctx.fillStyle = '#0b0b0b';
    ctx.fillRect(0,0,viewW,viewH);

    if (img){
      const iw = img.width * zoom;
      const ih = img.height * zoom;
      const bounded = ensureWithinBounds(origin.x, origin.y, iw, ih);
      if (bounded.x !== origin.x || bounded.y !== origin.y){
        setOrigin(bounded);
      }
      setImgDraw({w: iw, h: ih});
      ctx.drawImage(img, bounded.x, bounded.y, iw, ih);
    }

    // overlay crop window
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,viewW,viewH);
    ctx.clearRect(cropX, cropY, cropW, cropH);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    // preview
    const pv = 160;
    const pw = pv;
    const ph = pv / aspect;
    p.width = pw; p.height = ph;
    pctx.fillStyle = '#111';
    pctx.fillRect(0,0,pw,ph);
    pctx.drawImage(c, cropX, cropY, cropW, cropH, 0, 0, pw, ph);
  };

  function loadFile(f: File | null){
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        if (im.naturalWidth < minWidth || im.naturalHeight < minHeight){
          setMessage(`La imagen es muy pequeña (${im.naturalWidth}x${im.naturalHeight}). Mínimo ${minWidth}x${minHeight}px.`);
        } else {
          setMessage('');
        }
        setImg(im);
        const baseZoom = computeBaseZoom(im);
        setZoom(baseZoom);
        const iw = im.width * baseZoom, ih = im.height * baseZoom;
        setImgDraw({w: iw, h: ih});
        setOrigin({ x: (600 - iw)/2, y: (400 - ih)/2 });
      };
      im.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  }

  function onWheel(e: React.WheelEvent){
    if (!img) return;
    e.preventDefault();
    const z = Math.max(0.3, Math.min(4, zoom + (e.deltaY < 0 ? 0.05 : -0.05)));
    setZoom(z);
  }
  function onMouseDown(){ setDragging(true); }
  function onMouseUp(){ setDragging(false); }
  function onMouseMove(e: React.MouseEvent){
    if (!dragging || !img) return;
    const nx = origin.x + e.movementX;
    const ny = origin.y + e.movementY;
    const bounded = ensureWithinBounds(nx, ny, imgDraw.w, imgDraw.h);
    setOrigin(bounded);
  }

  // touch
  function getTouchDist(touches: TouchList){
    if (touches.length < 2) return 0;
    const [a,b] = [touches[0], touches[1]];
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx*dx + dy*dy);
  }
  function onTouchStart(e: React.TouchEvent){
    if (!img) return;
    if (e.touches.length === 2){
      setTouchDist(getTouchDist(e.touches));
    }
  }
  function onTouchMove(e: React.TouchEvent){
    if (!img) return;
    if (e.touches.length === 1){
      setOrigin(prev => ({...prev}));
    } else if (e.touches.length === 2){
      const dist = getTouchDist(e.touches);
      if (touchDist){
        const diff = dist - touchDist;
        const z = Math.max(0.3, Math.min(4, zoom + diff/300));
        setZoom(z);
      }
      setTouchDist(dist);
    }
  }
  function onTouchEnd(){ setTouchDist(null); }

  function reset(){
    if (!img) return;
    const baseZoom = computeBaseZoom(img);
    setZoom(baseZoom);
    const iw = img.width * baseZoom, ih = img.height * baseZoom;
    setImgDraw({w: iw, h: ih});
    setOrigin({ x: (600 - iw)/2, y: (400 - ih)/2 });
    setMessage('Imagen restablecida.');
    setTimeout(()=>setMessage(''), 1200);
  }

  function addWatermarkIfNeeded(out: HTMLCanvasElement){
    if (!wmEnabled || !wmLogo) return;
    const ctx = out.getContext('2d')!;
    const margin = watermark?.margin ?? 12;
    const scale = watermark?.scale ?? 0.18;
    const opacity = watermark?.opacity ?? 0.15;
    const corner = watermark?.corner ?? 'br';

    const side = Math.min(out.width, out.height) * scale;
    const ratio = wmLogo.width / wmLogo.height;
    const w = side;
    const h = side / ratio;

    let x = margin, y = margin;
    if (corner.includes('r')) x = out.width - w - margin;
    if (corner.startsWith('b')) y = out.height - h - margin;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(wmLogo, x, y, w, h);
    ctx.restore();
  }

  function compressValidateWatermark(canvas: HTMLCanvasElement){
    const out = document.createElement('canvas');
    out.width = Math.round(cropW);
    out.height = Math.round(cropH);
    const octx = out.getContext('2d')!;
    octx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, out.width, out.height);
    addWatermarkIfNeeded(out);
    const data = out.toDataURL('image/jpeg', quality);
    const bytes = Math.ceil((data.length - 'data:image/jpeg;base64,'.length) * 3 / 4);
    const mb = bytes / (1024*1024);
    if (mb > maxMB){
      setMessage(`La imagen final pesa ${mb.toFixed(2)}MB; máx ${maxMB}MB. Baja el zoom o usa otra imagen.`);
      return null;
    }
    return data;
  }

  function doCrop(){
    const c = canvasRef.current;
    if (!c){ setMessage('No hay lienzo.'); return; }
    if (!img){
      setMessage('Primero sube una imagen.');
      return;
    }
    if (img.naturalWidth < minWidth || img.naturalHeight < minHeight){
      setMessage(`La imagen es muy pequeña (${img.naturalWidth}x${img.naturalHeight}). Mínimo ${minWidth}x${minHeight}px.`);
      return;
    }
    const data = compressValidateWatermark(c);
    if (!data) return;
    onCropped(data);
    setMessage('Imagen recortada ✔');
    setTimeout(()=>setMessage(''), 1500);
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <label>{label}</label>
        <div className="flex items-center gap-3">
          {watermark && (
            <label className="flex items-center gap-2" title="Aplicar marca de agua con el logo">
              <input type="checkbox" checked={wmEnabled} onChange={e=>setWmEnabled(e.target.checked)} />
              <span>Marca de agua</span>
            </label>
          )}
          <button type="button" className="btn" onClick={()=>setShowBigPreview(true)}>Previsualizar grande</button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e)=>loadFile(e.target.files?.[0] || null)} />
        {allowCamera && (
          <>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={(e)=>loadFile(e.target.files?.[0] || null)} />
            <button className="btn" type="button" onClick={()=>cameraInputRef.current?.click()}>📷 Tomar foto</button>
          </>
        )}
        <button type="button" className="btn" onClick={reset}>Restablecer</button>
      </div>
      {message && <div className="badge mt-2">{message}</div>}

      <div className="mt-2" style={{display:'grid', gridTemplateColumns:'1fr 200px', gap:12}}>
        <div>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{width:'100%', background:'#000', borderRadius:12, border:'1px solid #1f2937', touchAction:'none'}}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
          <div className="mt-2 flex items-center gap-2">
            Zoom: <input type="range" min="0.3" max="4" step="0.01" value={zoom} onChange={(e)=>setZoom(parseFloat(e.target.value))} />
            <span className="badge">{Math.round(zoom*100)}%</span>
          </div>
        </div>
        <div>
          <div style={{fontSize:12, opacity:.8, marginBottom:6}}>Vista previa</div>
          <canvas ref={previewRef} width={160} height={160} style={{width:160, height:'auto', background:'#000', borderRadius:12, border:'1px solid #1f2937'}} />
          <button type="button" className="btn mt-3" onClick={doCrop}>Usar esta imagen</button>
        </div>
      </div>

      {showBigPreview && (
        <div className="modal-backdrop" onClick={()=>setShowBigPreview(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>Previsualización grande</h3>
            <div style={{maxWidth:'90vw', maxHeight:'70vh'}}>
              <canvas
                width={Math.round(540)}
                height={Math.round(540 / aspect)}
                ref={(node)=>{
                  if (!node) return;
                  const src = canvasRef.current;
                  if (!src) return;
                  const ctx = node.getContext('2d')!;
                  ctx.fillStyle='#000'; ctx.fillRect(0,0,node.width,node.height);
                  // compute source crop
                  const cropW = Math.min(600*0.9, aspect >= 1 ? Math.min(600*0.9, (400*0.9)*aspect) : 600*0.9);
                  const cropH = cropW / aspect;
                  const cropX = (600 - cropW)/2;
                  const cropY = (400 - cropH)/2;
                  ctx.drawImage(src, cropX, cropY, cropW, cropH, 0, 0, node.width, node.height);
                }}
                style={{maxWidth:'100%', borderRadius:12, border:'1px solid #1f2937'}}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn" onClick={()=>setShowBigPreview(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
