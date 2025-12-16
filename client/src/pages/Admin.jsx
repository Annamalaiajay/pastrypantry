import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaClipboardList, FaHamburger, FaVideo, FaTrash, FaTimes, FaCloudUploadAlt, FaPalette, FaImage, FaFont, FaCropAlt } from 'react-icons/fa';
import io from 'socket.io-client';
import Cropper from 'react-easy-crop'; // IMPORT THE CROPPER
import getCroppedImg from '../utils/cropUtils'; // IMPORT THE UTILITY

const socket = io.connect("https://pastry-server.onrender.com");

function Admin({ colors = {} }) {
  if (!colors || !colors.bg) return <div style={{padding:'50px', textAlign:'center'}}>Loading Admin Panel...</div>;

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [posters, setPosters] = useState([]); 
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedCustomer, setSelectedCustomer] = useState(null); 
  const [viewImage, setViewImage] = useState(null); 
  
  // UPLOAD & CROP STATES
  const [uploading, setUploading] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null); // Stores raw image before crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCroppingPoster, setIsCroppingPoster] = useState(false); // Toggle Modal

  // Forms
  const [form, setForm] = useState({ name: '', description: '', price: '', image1: '', image2: '', image3: '', video: '', isSignature: false });
  const [posterForm, setPosterForm] = useState({ 
    title: '', subtitle: '', imageUrl: '', videoUrl: '', 
    layoutType: 'cover', templateStyle: 'classic', fontFamily: 'Arial'
  });

  const templates = [
    { id: 'classic', name: 'Classic Minimal' }, { id: 'bold', name: 'Ultra Bold' },
    { id: 'neon', name: 'Neon Night' }, { id: 'elegant', name: 'Elegant Gold' },
    { id: 'sale', name: 'Flash Sale' }, { id: 'ocean', name: 'Ocean Breeze' },
    { id: 'retro', name: 'Retro Pixel' }, { id: 'candy', name: 'Candy Pop' },
    { id: 'darkmode', name: 'Midnight Pro' }, { id: 'frame', name: 'Cinematic Frame' },
  ];

  const fonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { name: 'Lucida Console', value: '"Lucida Console", monospace' },
    { name: 'Brush Script', value: '"Brush Script MT", cursive' },
    { name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  ];

  useEffect(() => { 
    fetchOrders(); fetchProducts(); fetchPosters();
    socket.on("new_order", (newOrder) => { alert(`🔔 New Order!`); setOrders((prev) => [newOrder, ...prev]); });
    return () => socket.off("new_order");
  }, []);

  const fetchOrders = async () => { try { const res = await axios.get('https://pastry-server.onrender.com/api/orders'); setOrders(res.data); } catch (err) {} };
  const fetchProducts = async () => { try { const res = await axios.get('https://pastry-server.onrender.com/api/products'); setProducts(res.data); } catch (err) {} };
  const fetchPosters = async () => { try { const res = await axios.get('https://pastry-server.onrender.com/api/posters'); setPosters(res.data); } catch (err) {} };

  const updateStatus = async (id, newStatus) => {
    if (newStatus === "Paid" && !window.confirm("Approve Payment?")) return;
    try { await axios.put(`https://pastry-server.onrender.com/api/orders/${id}`, { status: newStatus }); fetchOrders(); } catch (err) { alert("Error"); }
  };

  // 1. INITIAL FILE SELECTION
  const onFileSelect = async (e, type, fieldName) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // If it's a Video, upload directly (No crop support)
      if (file.type.startsWith('video/')) {
          handleDirectUpload(file, type, fieldName);
          return;
      }

      // If it's an Image for Banner -> Open Cropper
      if (type === 'poster') {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setTempImageSrc(reader.result);
            setIsCroppingPoster(true); // Open Modal
        });
        reader.readAsDataURL(file);
      } 
      // If Product Image -> Upload directly (Simplified)
      else {
        handleDirectUpload(file, type, fieldName);
      }
    }
  };

  // 2. CROP COMPLETE HANDLER
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 3. EXECUTE CROP AND UPLOAD
  const finishCropAndUpload = async () => {
    try {
        setUploading(true);
        const croppedBlob = await getCroppedImg(tempImageSrc, croppedAreaPixels);
        
        // Convert Blob to File
        const file = new File([croppedBlob], "banner_crop.jpg", { type: "image/jpeg" });
        
        // Upload
        const formData = new FormData();
        formData.append('screenshot', file);
        const res = await axios.post('https://pastry-server.onrender.com/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        
        setPosterForm({ ...posterForm, imageUrl: res.data.imageUrl, videoUrl: '' });
        setIsCroppingPoster(false); // Close Modal
        alert("✅ Image Cropped & Uploaded!");
    } catch (e) {
        console.error(e);
        alert("Crop Failed");
    } finally {
        setUploading(false);
    }
  };

  // DIRECT UPLOAD (For Videos / Product Images)
  const handleDirectUpload = async (file, type, fieldName) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('screenshot', file);
    try {
      const res = await axios.post('https://pastry-server.onrender.com/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (type === 'poster') setPosterForm({ ...posterForm, videoUrl: res.data.imageUrl, imageUrl: '' });
      else setForm({ ...form, [fieldName]: res.data.imageUrl });
      alert("✅ Uploaded!");
    } catch (err) { alert("Upload Failed"); } 
    finally { setUploading(false); }
  };

  const handleAddProduct = async (e) => { 
    e.preventDefault(); 
    const images = [form.image1]; if(form.image2) images.push(form.image2); if(form.image3) images.push(form.image3);
    await axios.post('https://pastry-server.onrender.com/api/products', { name: form.name, description: form.description, price: form.price, images, video: form.video, isSignature: form.isSignature }); 
    alert('Product Added!'); fetchProducts(); 
  };

  const handleAddPoster = async (e) => {
    e.preventDefault();
    if(!posterForm.imageUrl && !posterForm.videoUrl && !posterForm.title) return alert("Please add Content.");
    await axios.post('https://pastry-server.onrender.com/api/posters', posterForm);
    alert("Banner Added!");
    setPosterForm({ title: '', subtitle: '', imageUrl: '', videoUrl: '', layoutType: 'cover', templateStyle: 'classic', fontFamily: 'Arial' });
    fetchPosters();
  };

  const handleDeletePoster = async (id) => { if(!window.confirm("Delete?")) return; await axios.delete(`https://pastry-server.onrender.com/api/posters/${id}`); fetchPosters(); };

  const displayedOrders = selectedCustomer ? orders.filter(o => o.customerName === selectedCustomer) : orders;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.status !== 'Cancelled' ? order.totalPrice : 0), 0);

  const tabBtnStyle = (isActive) => ({ padding: '10px 20px', margin:'0 10px 0 0', borderRadius:'20px', border:'none', cursor:'pointer', background: isActive ? colors.accent : colors.cardBg, color: isActive ? 'white' : colors.text, fontWeight:'bold', display:'flex', alignItems:'center', gap:'8px' });
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text };
  const uploadBtnStyle = { display:'flex', alignItems:'center', gap:'5px', padding:'8px', background: colors.cardBg, border:`1px solid ${colors.border}`, borderRadius:'5px', cursor:'pointer', fontSize:'11px', fontWeight:'bold', color: colors.text };

  const ImageModal = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => setViewImage(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'red', color: 'white', border: 'none', fontSize: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}><FaTimes /> Close</button>
        <img src={viewImage} alt="Proof" style={{ maxHeight: '80%', maxWidth: '90%', borderRadius: '10px' }} />
    </div>
  );

  return (
    <div style={{ padding: '30px', backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
      {viewImage && <ImageModal />}

      {/* --- CROPPER MODAL (NEW) --- */}
      {isCroppingPoster && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000', zIndex: 10000, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '15px', background: '#111', display: 'flex', justifyContent: 'space-between', color: 'white', zIndex: 2 }}>
                <h3>Adjust Banner Image</h3>
                <button onClick={() => setIsCroppingPoster(false)} style={{background:'red', border:'none', color:'white', padding:'5px 15px', borderRadius:'5px', cursor:'pointer'}}>Cancel</button>
            </div>
            
            <div style={{ position: 'relative', flex: 1, background: '#333' }}>
                <Cropper
                    image={tempImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9} // Standard Banner Ratio
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div style={{ padding: '20px', background: '#111', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} style={{width:'200px'}} />
                <button onClick={finishCropAndUpload} style={{padding:'10px 20px', background:colors.accent, color:'white', border:'none', borderRadius:'5px', fontSize:'16px', fontWeight:'bold', cursor:'pointer'}}>
                    {uploading ? "Cropping & Uploading..." : "✂️ Crop & Upload Banner"}
                </button>
            </div>
        </div>
      )}

      <h1 style={{marginBottom:'20px'}}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, background: colors.cardBg, padding: '20px', borderRadius: '10px', border: `1px solid ${colors.border}` }}><h3>Revenue</h3><p style={{fontSize:'24px', fontWeight:'bold', color:'#4caf50'}}>₹{totalRevenue}</p></div>
        <div style={{ flex: 1, background: colors.cardBg, padding: '20px', borderRadius: '10px', border: `1px solid ${colors.border}` }}><h3>Orders</h3><p style={{fontSize:'24px', fontWeight:'bold', color:colors.accent}}>{orders.length}</p></div>
      </div>

      <div style={{ marginBottom: '20px', display:'flex' }}>
        <button onClick={() => setActiveTab('orders')} style={tabBtnStyle(activeTab === 'orders')}><FaClipboardList /> Orders</button>
        <button onClick={() => setActiveTab('menu')} style={tabBtnStyle(activeTab === 'menu')}><FaHamburger /> Menu</button>
        <button onClick={() => setActiveTab('banners')} style={tabBtnStyle(activeTab === 'banners')}><FaVideo /> Banners</button>
      </div>

      {activeTab === 'orders' && (
        <div style={{ background: colors.cardBg, padding: '20px', borderRadius: '10px', border: `1px solid ${colors.border}` }}>
          {displayedOrders.map((order) => (
            <div key={order._id} style={{ borderBottom: `1px solid ${colors.border}`, padding: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4>#{order._id.slice(-6).toUpperCase()} ({order.paymentMethod})</h4>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <div>{order.items.map(i => i.productName).join(', ')}</div>
                {order.paymentDetails?.screenshotUrl && (
                    <button onClick={() => setViewImage(order.paymentDetails.screenshotUrl)} style={{color:'#007bff', background:'none', border:'none', cursor:'pointer', marginTop:'5px', textDecoration:'underline', display:'flex', alignItems:'center', gap:'5px'}}>
                        <FaImage /> View Screenshot
                    </button>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>₹{order.totalPrice}</span><br/>
                <span style={{padding:'5px 10px', borderRadius:'5px', fontSize:'12px', fontWeight:'bold', backgroundColor: order.status === 'Paid' ? '#2e7d32' : (order.status === 'Pending' ? '#ef6c00' : '#d32f2f'), color: '#ffffff', display: 'inline-block', marginTop: '5px' }}>{order.status}</span>
                {order.status !== "Paid" && <button onClick={() => updateStatus(order._id, 'Paid')} style={{ display:'block', marginTop:'10px', padding: '5px 10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Approve Payment</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'menu' && (
        <div style={{ display: 'flex', gap: '30px', flexWrap:'wrap' }}>
            <form onSubmit={handleAddProduct} style={{flex:1, minWidth:'350px', background:colors.cardBg, padding:'20px', borderRadius:'10px', border:`1px solid ${colors.border}`}}>
                <h3 style={{marginBottom:'15px'}}>Add Product</h3>
                <input name="name" placeholder="Product Name" onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle}/>
                <input name="price" placeholder="Price (₹)" onChange={e => setForm({...form, price: e.target.value})} required style={inputStyle}/>
                <textarea name="description" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} required style={inputStyle}/>
                
                <p style={{fontSize:'12px', fontWeight:'bold', marginTop:'10px'}}>Images (3 Slots):</p>
                {[1, 2, 3].map(num => (
                    <div key={num} style={{marginBottom:'5px', display:'flex', gap:'5px'}}>
                        <input placeholder={`Image URL ${num}`} value={form[`image${num}`]} onChange={e => setForm({...form, [`image${num}`]: e.target.value})} style={{...inputStyle, marginBottom:0, flex:1}}/>
                        <label style={uploadBtnStyle}>
                            <FaCloudUploadAlt /> <input type="file" onChange={(e) => onFileSelect(e, 'product', `image${num}`)} accept="image/*" style={{display:'none'}} />
                        </label>
                    </div>
                ))}

                <p style={{fontSize:'12px', fontWeight:'bold', marginTop:'10px'}}>Product Video (Optional):</p>
                <div style={{marginBottom:'15px', display:'flex', gap:'5px'}}>
                    <input placeholder="Video URL or Upload" value={form.video} onChange={e => setForm({...form, video: e.target.value})} style={{...inputStyle, marginBottom:0, flex:1}}/>
                    <label style={uploadBtnStyle}>
                        <FaVideo /> <input type="file" onChange={(e) => onFileSelect(e, 'product', 'video')} accept="video/*" style={{display:'none'}} />
                    </label>
                </div>

                <div style={{marginBottom:'15px'}}>
                    <label style={{fontSize:'14px', display:'flex', alignItems:'center', gap:'10px'}}>
                        <input type="checkbox" checked={form.isSignature} onChange={e => setForm({...form, isSignature: e.target.checked})} />
                        Set as Signature Item?
                    </label>
                </div>

                <button style={{width:'100%', padding:'10px', background:colors.accent, color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>{uploading ? 'Uploading...' : 'Add Product'}</button>
            </form>
            
            <div style={{flex:1, minWidth:'300px', background:colors.cardBg, padding:'20px', borderRadius:'10px', maxHeight:'600px', overflowY:'auto'}}>
                <h3>Preview Menu</h3>
                {products.map(p => (
                    <div key={p._id} style={{padding:'10px', borderBottom:'1px solid #ccc', display:'flex', gap:'10px'}}>
                        <img src={p.images?.[0] || p.image} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'5px'}} />
                        <div>
                            <div style={{fontWeight:'bold'}}>{p.name}</div>
                            <div style={{fontSize:'12px'}}>₹{p.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'banners' && (
        <div style={{ display: 'flex', gap: '30px', flexWrap:'wrap' }}>
            <form onSubmit={handleAddPoster} style={{flex:1, minWidth:'400px', background:colors.cardBg, padding:'20px', borderRadius:'10px', border:`1px solid ${colors.border}`}}>
                <h3 style={{marginBottom:'15px'}}>Design Poster</h3>
                
                <div style={{marginBottom:'20px'}}>
                    <label style={{fontSize:'12px', fontWeight:'bold', color:colors.accent}}>Line 1: BIG TEXT</label>
                    <textarea rows="2" placeholder="Title" value={posterForm.title} onChange={e => setPosterForm({...posterForm, title: e.target.value})} style={{...inputStyle, resize:'vertical'}}/>
                    <label style={{fontSize:'12px', fontWeight:'bold', color:colors.accent}}>Line 2: Small Text</label>
                    <textarea rows="2" placeholder="Subtitle" value={posterForm.subtitle} onChange={e => setPosterForm({...posterForm, subtitle: e.target.value})} style={{...inputStyle, resize:'vertical'}}/>
                </div>

                <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                    <select value={posterForm.fontFamily} onChange={e => setPosterForm({...posterForm, fontFamily: e.target.value})} style={{...inputStyle, flex:1}}>{fonts.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}</select>
                    {!posterForm.imageUrl && !posterForm.videoUrl && (
                        <select value={posterForm.templateStyle} onChange={e => setPosterForm({...posterForm, templateStyle: e.target.value})} style={{...inputStyle, flex:1}}>{templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                    )}
                </div>
                
                <div style={{marginBottom:'15px', padding:'10px', background:colors.bg, borderRadius:'5px'}}>
                    <label style={{fontSize:'12px', fontWeight:'bold'}}>Background Media:</label>
                    <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                        <input placeholder="Paste URL or Upload ->" value={posterForm.imageUrl || posterForm.videoUrl} onChange={e => setPosterForm({...posterForm, imageUrl: e.target.value})} style={{...inputStyle, marginBottom:0, flex:1}}/>
                        <label style={uploadBtnStyle}>
                            <FaCloudUploadAlt /> 
                            <span style={{marginLeft:'5px'}}>Upload Image to Crop</span>
                            <input type="file" onChange={(e) => onFileSelect(e, 'poster')} accept="image/*,video/*" style={{display:'none'}} />
                        </label>
                    </div>
                </div>

                <div style={{marginBottom:'15px'}}>
                    <select value={posterForm.layoutType} onChange={e => setPosterForm({...posterForm, layoutType: e.target.value})} style={inputStyle}>
                        <option value="cover">Full Landscape (Cover)</option>
                        <option value="contain">Original Size (Contain)</option>
                    </select>
                </div>

                <button style={{width:'100%', padding:'12px', background:colors.accent, color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>{uploading ? 'Processing...' : '+ Publish Banner'}</button>
            </form>

            <div style={{flex:1, minWidth:'300px', background:colors.cardBg, padding:'20px', borderRadius:'10px', border:`1px solid ${colors.border}`}}>
                <h3>Active Posters</h3>
                {posters.map(poster => (
                    <div key={poster._id} style={{ display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:`1px solid ${colors.border}` }}>
                        <div>
                            <strong style={{fontFamily: poster.fontFamily}}>{poster.title || '(No Title)'}</strong>
                            <div style={{fontSize:'10px', color:colors.accent}}>
                                {poster.imageUrl ? <span style={{color:'green'}}>🖼️ Image (Cropped)</span> : (poster.videoUrl ? '📽️ Video' : '📝 Text')}
                            </div>
                        </div>
                        <button onClick={() => handleDeletePoster(poster._id)} style={{background:'red', color:'white', border:'none', padding:'5px', borderRadius:'5px'}}><FaTrash /></button>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}

export default Admin;