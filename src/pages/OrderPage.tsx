import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, X, FileText, Image, File, AlertCircle, CheckCircle,
  ArrowRight, ArrowLeft, Calculator, Package, CreditCard, Info
} from 'lucide-react';
import {
  calculatePrice, paperTypeLabels, bindingLabels,
  type PaperSize, type PaperType, type PrintColor, type PrintSide, type BindingType
} from '@/lib/pricingData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpeg', '.jpg', '.png'];

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

export default function OrderPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pages, setPages] = useState(100);
  const [copies, setCopies] = useState(1);
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [paperType, setPaperType] = useState<PaperType>('70gsm_normal');
  const [printColor, setPrintColor] = useState<PrintColor>('bw');
  const [printSide, setPrintSide] = useState<PrintSide>('double');
  const [bindingType, setBindingType] = useState<BindingType>('perfect_glue');
  const [lamination, setLamination] = useState<'none' | 'glossy' | 'matt' | 'velvate'>('none');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'courier'>('pickup');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const price = calculatePrice({ pages, copies, paperSize, paperType, printColor, printSide, bindingType });
  const deliveryCharge = deliveryType === 'courier' ? 80 : 0;
  const totalWithDelivery = price.grandTotal + deliveryCharge;

  const simulateUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).slice(2);
      const newFile: UploadedFile = { file, id, progress: 0, status: 'uploading' };
      setFiles((prev) => [...prev, newFile]);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: 100, status: 'done' } : f));
          resolve();
        } else {
          setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: Math.floor(progress) } : f));
        }
      }, 200);
    });
  };

  const handleFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is too large. Max size is 25MB.`);
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`${file.name} is not a supported file type. Allowed: PDF, DOC, DOCX, JPEG, JPG, PNG`);
        continue;
      }
      await simulateUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const placeOrder = () => {
    const id = 'BP' + Date.now().toString().slice(-8).toUpperCase();
    setOrderId(id);
    setOrderPlaced(true);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return <FileText className="h-5 w-5 text-primary" />;
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center animate-slide-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-3">Order Placed!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been successfully placed. We'll start printing soon!
            </p>
            <div className="bg-secondary rounded-xl p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Order ID</span>
                <span className="text-primary font-bold font-mono">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Total Amount</span>
                <span className="text-white font-bold">₹{totalWithDelivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Status</span>
                <span className="text-yellow-400 font-medium">Pending</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Delivery</span>
                <span className="text-white/80 text-sm">{deliveryType === 'courier' ? 'Courier Delivery' : 'Store Pickup'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to={`/tracking?orderId=${orderId}`}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 text-center"
              >
                Track Order
              </Link>
              <Link
                to="/"
                className="w-full border border-border text-foreground font-medium py-3 rounded-lg hover:bg-muted transition-all duration-200 text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20">
        {/* Header */}
        <div className="bg-secondary py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Place Your Order</h1>
            <p className="text-white/60">Upload files, choose print options and proceed to payment</p>

            {/* Steps */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { n: 1, label: 'Upload & Options' },
                { n: 2, label: 'Delivery Details' },
                { n: 3, label: 'Payment' },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step >= s.n ? 'bg-primary text-white' : 'bg-white/10 text-white/40'
                  }`}>
                    {step > s.n ? <CheckCircle className="h-4 w-4" /> : s.n}
                  </div>
                  <span className={`text-sm hidden sm:block ${step >= s.n ? 'text-white' : 'text-white/40'}`}>
                    {s.label}
                  </span>
                  {i < 2 && <div className={`w-8 sm:w-16 h-0.5 ${step > s.n ? 'bg-primary' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-slide-up">
                  {/* File Upload */}
                  <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" /> Upload Your Files
                    </h2>

                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      <Upload className={`h-10 w-10 mx-auto mb-3 transition-colors duration-200 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="font-semibold text-foreground mb-1">Drag & drop files here</p>
                      <p className="text-muted-foreground text-sm mb-3">or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supported: PDF, DOC, DOCX, JPEG, JPG, PNG • Max 25MB per file</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept={ALLOWED_EXTENSIONS.join(',')}
                        onChange={(e) => e.target.files && handleFiles(e.target.files)}
                      />
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((f) => (
                          <div key={f.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            {getFileIcon(f.file)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{f.file.name}</p>
                              <p className="text-xs text-muted-foreground">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                              {f.status === 'uploading' && (
                                <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                    style={{ width: `${f.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                            {f.status === 'done' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                            {f.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
                            <button onClick={() => removeFile(f.id)} className="p-1 hover:bg-muted rounded transition-colors">
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Print Preferences */}
                  <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" /> Print Preferences
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Number of Pages</label>
                        <input type="number" min={1} value={pages} onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Number of Copies</label>
                        <input type="number" min={1} value={copies} onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Paper Size</label>
                        <select value={paperSize} onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                          <option value="A4">A4 (210×297mm / 8.27×11.69")</option>
                          <option value="B5">B5 (176×250mm / 6.9×9.8")</option>
                          <option value="A5">A5 (148×210mm / 5.83×8.27")</option>
                          <option value="6x9">6×9 inch</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Paper Type</label>
                        <select value={paperType} onChange={(e) => setPaperType(e.target.value as PaperType)}
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                          {Object.entries(paperTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Print Color</label>
                        <div className="flex gap-2">
                          {[{ v: 'bw', l: 'B&W' }, { v: 'color', l: 'Full Color' }].map((o) => (
                            <button key={o.v} onClick={() => setPrintColor(o.v as PrintColor)}
                              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${printColor === o.v ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                              {o.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Printing Side</label>
                        <div className="flex gap-2">
                          {[{ v: 'double', l: 'Double Side' }, { v: 'single', l: 'Single Side' }].map((o) => (
                            <button key={o.v} onClick={() => setPrintSide(o.v as PrintSide)}
                              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${printSide === o.v ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                              {o.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Binding Type</label>
                        <select value={bindingType} onChange={(e) => setBindingType(e.target.value as BindingType)}
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                          {Object.entries(bindingLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Cover Lamination</label>
                        <select value={lamination} onChange={(e) => setLamination(e.target.value as any)}
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                          <option value="none">No Lamination</option>
                          <option value="glossy">Glossy Lamination</option>
                          <option value="matt">Matt Lamination</option>
                          <option value="velvate">Velvate Lamination</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">Delivery Option</label>
                        <div className="flex gap-3">
                          {[{ v: 'pickup', l: '🏪 Store Pickup (Free)' }, { v: 'courier', l: '🚚 Courier Delivery (+₹80)' }].map((o) => (
                            <button key={o.v} onClick={() => setDeliveryType(o.v as any)}
                              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 border ${deliveryType === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:bg-muted/80'}`}>
                              {o.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-1">Special Instructions</label>
                        <textarea rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Any special requirements or notes..."
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" />
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setStep(2)} disabled={files.filter(f => f.status === 'done').length === 0}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-lg hover:bg-primary/90 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    Continue to Delivery <ArrowRight className="h-5 w-5" />
                  </button>
                  {files.filter(f => f.status === 'done').length === 0 && (
                    <p className="text-center text-muted-foreground text-sm">Please upload at least one file to continue</p>
                  )}
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-4">Delivery Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Full Name *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Phone / WhatsApp *</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                          className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                      {deliveryType === 'courier' && (
                        <>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-foreground mb-1">Delivery Address *</label>
                            <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full delivery address..."
                              className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Pincode *</label>
                            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="110001"
                              className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                          </div>
                        </>
                      )}
                      {deliveryType === 'pickup' && (
                        <div className="sm:col-span-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-foreground font-medium">📍 Pickup Location</p>
                          <p className="text-sm text-muted-foreground mt-1">BookPrinters.in Store, Delhi, India</p>
                          <p className="text-xs text-muted-foreground mt-1">Mon–Sat: 9AM–8PM</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 border border-border text-foreground font-medium py-3 rounded-xl hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button onClick={() => setStep(3)} disabled={!name || !phone}
                      className="flex-[2] bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      Continue to Payment <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment */}
              {step === 3 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" /> Payment
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">Secure payment powered by Razorpay</p>

                    {/* Razorpay UI Mockup */}
                    <div className="border border-border rounded-xl overflow-hidden">
                      <div className="bg-secondary p-4 flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-xs">BookPrinters.in</p>
                          <p className="text-white font-bold text-lg">₹{totalWithDelivery.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-xs">Powered by</p>
                          <p className="text-white font-bold text-sm">razorpay</p>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {['UPI', 'Cards', 'Net Banking'].map((method) => (
                            <button key={method} className="p-3 border border-border rounded-lg text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center">
                              {method}
                            </button>
                          ))}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-1">UPI ID</label>
                          <input type="text" placeholder="yourname@upi"
                            className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                          <Info className="h-4 w-4 text-primary shrink-0" />
                          <p className="text-xs text-muted-foreground">This is a demo UI. Real Razorpay integration coming soon.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 border border-border text-foreground font-medium py-3 rounded-xl hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button onClick={placeOrder}
                      className="flex-[2] bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                      Confirm & Place Order <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-secondary p-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> Order Summary
                  </h3>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  {[
                    { label: 'Pages', value: `${pages} pages` },
                    { label: 'Copies', value: `${copies} copies` },
                    { label: 'Paper Size', value: paperSize },
                    { label: 'Paper Type', value: paperTypeLabels[paperType].split(' ').slice(0, 3).join(' ') },
                    { label: 'Print Color', value: printColor === 'bw' ? 'B&W' : 'Color' },
                    { label: 'Printing Side', value: printSide === 'double' ? 'Double Side' : 'Single Side' },
                    { label: 'Binding', value: bindingLabels[bindingType].split('(')[0].trim() },
                    { label: 'Lamination', value: lamination === 'none' ? 'None' : lamination.charAt(0).toUpperCase() + lamination.slice(1) },
                    { label: 'Delivery', value: deliveryType === 'courier' ? 'Courier (+₹80)' : 'Store Pickup' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground text-right">{item.value}</span>
                    </div>
                  ))}

                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Per Page</span>
                      <span>₹{price.pricePerPage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Printing Cost</span>
                      <span>₹{price.printingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Binding Cost</span>
                      <span>₹{price.bindingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (18%)</span>
                      <span>₹{price.gst.toFixed(2)}</span>
                    </div>
                    {deliveryType === 'courier' && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery</span>
                        <span>₹80.00</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-black text-primary text-xl">₹{totalWithDelivery.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 text-xs text-muted-foreground text-center">
                    Inclusive of all taxes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}



