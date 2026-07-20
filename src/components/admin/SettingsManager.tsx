"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Settings, Save, Loader2, CheckCircle2, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";

interface CompanyInfo {
  whatsapp: string;
  whatsapp2: string;
  email: string;
  email2: string;
  address: string;
  address2: string;
  tiktok: string;
  facebook: string;
  instagram: string;
  youtube: string;

  heroCardImage1?: string;
  heroCardStoragePath1?: string;
  heroCardImage2?: string;
  heroCardStoragePath2?: string;
  heroCardImage3?: string;
  heroCardStoragePath3?: string;
  heroBgImage?: string;
  heroBgStoragePath?: string;
  logoUrl?: string;
  logoStoragePath?: string;
  aboutImageUrl1?: string;
  aboutStoragePath1?: string;
  locationImage?: string;
  locationStoragePath?: string;

  certImage1?: string;
  certStoragePath1?: string;
  certTitle1?: string;
  certImage2?: string;
  certStoragePath2?: string;
  certTitle2?: string;
  certImage3?: string;
  certStoragePath3?: string;
  certTitle3?: string;
  certImage4?: string;
  certStoragePath4?: string;
  certTitle4?: string;
  certImage5?: string;
  certStoragePath5?: string;
  certTitle5?: string;
  certImage6?: string;
  certStoragePath6?: string;
  certTitle6?: string;
}

const DEFAULT_INFO: CompanyInfo = {
  whatsapp: "51915233460",
  whatsapp2: "",
  email: "contacto@apasajem.org",
  email2: "",
  address: "San Jerónimo, Matzuriniari, Satipo, Junín, Perú",
  address2: "",
  tiktok: "",
  facebook: "",
  instagram: "",
  youtube: "",
};

export default function SettingsManager() {
  const [formData, setFormData] = useState<CompanyInfo>(DEFAULT_INFO);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [heroCardFile1, setHeroCardFile1] = useState<File | null>(null);
  const [heroCardFile2, setHeroCardFile2] = useState<File | null>(null);
  const [heroCardFile3, setHeroCardFile3] = useState<File | null>(null);
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null);
  const heroCardInputRef1 = React.useRef<HTMLInputElement>(null);
  const heroCardInputRef2 = React.useRef<HTMLInputElement>(null);
  const heroCardInputRef3 = React.useRef<HTMLInputElement>(null);
  const heroBgInputRef = React.useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [aboutFile1, setAboutFile1] = useState<File | null>(null);
  const [locationFile, setLocationFile] = useState<File | null>(null);

  const [certFile1, setCertFile1] = useState<File | null>(null);
  const [certFile2, setCertFile2] = useState<File | null>(null);
  const [certFile3, setCertFile3] = useState<File | null>(null);
  const [certFile4, setCertFile4] = useState<File | null>(null);
  const [certFile5, setCertFile5] = useState<File | null>(null);
  const [certFile6, setCertFile6] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const aboutInputRef1 = React.useRef<HTMLInputElement>(null);
  const locationInputRef = React.useRef<HTMLInputElement>(null);

  const certInputRef1 = React.useRef<HTMLInputElement>(null);
  const certInputRef2 = React.useRef<HTMLInputElement>(null);
  const certInputRef3 = React.useRef<HTMLInputElement>(null);
  const certInputRef4 = React.useRef<HTMLInputElement>(null);
  const certInputRef5 = React.useRef<HTMLInputElement>(null);
  const certInputRef6 = React.useRef<HTMLInputElement>(null);
  const [visibleCertsCount, setVisibleCertsCount] = useState(1);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({ ...DEFAULT_INFO, ...data });

          let initialCount = 1;
          if (data.certImage6 || data.certTitle6) initialCount = 6;
          else if (data.certImage5 || data.certTitle5) initialCount = 5;
          else if (data.certImage4 || data.certTitle4) initialCount = 4;
          else if (data.certImage3 || data.certTitle3) initialCount = 3;
          else if (data.certImage2 || data.certTitle2) initialCount = 2;
          setVisibleCertsCount(initialCount);
        }
      } catch (err) {
        console.error("Error al cargar configuraciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHeroCardChange1 = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setHeroCardFile1(e.target.files[0]); };
  const handleHeroCardChange2 = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setHeroCardFile2(e.target.files[0]); };
  const handleHeroCardChange3 = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setHeroCardFile3(e.target.files[0]); };
  const handleHeroBgChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setHeroBgFile(e.target.files[0]); };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleAboutChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAboutFile1(e.target.files[0]);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLocationFile(e.target.files[0]);
    }
  };



  const handleCertChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFile1(e.target.files[0]);
    }
  };
  const handleCertChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFile2(e.target.files[0]);
    }
  };
  const handleCertChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFile3(e.target.files[0]);
    }
  };
  const handleCertChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFile4(e.target.files[0]);
    }
  };
  const handleCertChange5 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFile5(e.target.files[0]);
    }
  };
  const handleCertChange6 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFile6(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError("");

    try {
      const docRef = doc(db, "settings", "company_info");
      let currentHeroCardUrl1 = formData.heroCardImage1 || "";
      let currentHeroCardPath1 = formData.heroCardStoragePath1 || "";
      let currentHeroCardUrl2 = formData.heroCardImage2 || "";
      let currentHeroCardPath2 = formData.heroCardStoragePath2 || "";
      let currentHeroCardUrl3 = formData.heroCardImage3 || "";
      let currentHeroCardPath3 = formData.heroCardStoragePath3 || "";
      let currentHeroBgUrl = formData.heroBgImage || "";
      let currentHeroBgPath = formData.heroBgStoragePath || "";
      let currentLogoUrl = formData.logoUrl || "";
      let currentLogoPath = formData.logoStoragePath || "";
      let currentAboutUrl1 = formData.aboutImageUrl1 || "";
      let currentAboutPath1 = formData.aboutStoragePath1 || "";
      let currentLocationUrl = formData.locationImage || "";
      let currentLocationPath = formData.locationStoragePath || "";

      let currentCertUrl1 = formData.certImage1 || "";
      let currentCertPath1 = formData.certStoragePath1 || "";
      let currentCertUrl2 = formData.certImage2 || "";
      let currentCertPath2 = formData.certStoragePath2 || "";
      let currentCertUrl3 = formData.certImage3 || "";
      let currentCertPath3 = formData.certStoragePath3 || "";
      let currentCertUrl4 = formData.certImage4 || "";
      let currentCertPath4 = formData.certStoragePath4 || "";
      let currentCertUrl5 = formData.certImage5 || "";
      let currentCertPath5 = formData.certStoragePath5 || "";
      let currentCertUrl6 = formData.certImage6 || "";
      let currentCertPath6 = formData.certStoragePath6 || "";


      if (heroCardFile1) {
        const path = `settings/heroCard1_${Date.now()}_${heroCardFile1.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, heroCardFile1);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentHeroCardUrl1 = await getDownloadURL(task.snapshot.ref);
            currentHeroCardPath1 = path;
            resolve();
          });
        });
      }
      if (heroCardFile2) {
        const path = `settings/heroCard2_${Date.now()}_${heroCardFile2.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, heroCardFile2);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentHeroCardUrl2 = await getDownloadURL(task.snapshot.ref);
            currentHeroCardPath2 = path;
            resolve();
          });
        });
      }
      if (heroCardFile3) {
        const path = `settings/heroCard3_${Date.now()}_${heroCardFile3.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, heroCardFile3);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentHeroCardUrl3 = await getDownloadURL(task.snapshot.ref);
            currentHeroCardPath3 = path;
            resolve();
          });
        });
      }
      if (heroBgFile) {
        const path = `settings/heroBg_${Date.now()}_${heroBgFile.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, heroBgFile);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentHeroBgUrl = await getDownloadURL(task.snapshot.ref);
            currentHeroBgPath = path;
            resolve();
          });
        });
      }

      if (logoFile) {
        const logoPath = `settings/logo_${Date.now()}_${logoFile.name}`;
        const logoRef = ref(storage, logoPath);
        const logoUploadTask = uploadBytesResumable(logoRef, logoFile);

        await new Promise<void>((resolve, reject) => {
          logoUploadTask.on(
            "state_changed",
            null,
            (err) => reject(err),
            async () => {
              currentLogoUrl = await getDownloadURL(logoUploadTask.snapshot.ref);
              currentLogoPath = logoPath;
              resolve();
            }
          );
        });
      }

      if (aboutFile1) {
        const aboutPath1 = `settings/about1_${Date.now()}_${aboutFile1.name}`;
        const aboutRef1 = ref(storage, aboutPath1);
        const aboutUploadTask1 = uploadBytesResumable(aboutRef1, aboutFile1);

        await new Promise<void>((resolve, reject) => {
          aboutUploadTask1.on(
            "state_changed",
            null,
            (err) => reject(err),
            async () => {
              currentAboutUrl1 = await getDownloadURL(aboutUploadTask1.snapshot.ref);
              currentAboutPath1 = aboutPath1;
              resolve();
            }
          );
        });
      }

      if (locationFile) {
        const locationPath = `settings/location_${Date.now()}_${locationFile.name}`;
        const locationRef = ref(storage, locationPath);
        const locationUploadTask = uploadBytesResumable(locationRef, locationFile);

        await new Promise<void>((resolve, reject) => {
          locationUploadTask.on(
            "state_changed",
            null,
            (err) => reject(err),
            async () => {
              currentLocationUrl = await getDownloadURL(locationUploadTask.snapshot.ref);
              currentLocationPath = locationPath;
              resolve();
            }
          );
        });
      }



      if (certFile1) {
        const path = `settings/cert1_${Date.now()}_${certFile1.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, certFile1);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentCertUrl1 = await getDownloadURL(task.snapshot.ref);
            currentCertPath1 = path;
            resolve();
          });
        });
      }
      if (certFile2) {
        const path = `settings/cert2_${Date.now()}_${certFile2.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, certFile2);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentCertUrl2 = await getDownloadURL(task.snapshot.ref);
            currentCertPath2 = path;
            resolve();
          });
        });
      }
      if (certFile3) {
        const path = `settings/cert3_${Date.now()}_${certFile3.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, certFile3);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentCertUrl3 = await getDownloadURL(task.snapshot.ref);
            currentCertPath3 = path;
            resolve();
          });
        });
      }
      if (certFile4) {
        const path = `settings/cert4_${Date.now()}_${certFile4.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, certFile4);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentCertUrl4 = await getDownloadURL(task.snapshot.ref);
            currentCertPath4 = path;
            resolve();
          });
        });
      }
      if (certFile5) {
        const path = `settings/cert5_${Date.now()}_${certFile5.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, certFile5);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentCertUrl5 = await getDownloadURL(task.snapshot.ref);
            currentCertPath5 = path;
            resolve();
          });
        });
      }
      if (certFile6) {
        const path = `settings/cert6_${Date.now()}_${certFile6.name}`;
        const refObj = ref(storage, path);
        const task = uploadBytesResumable(refObj, certFile6);
        await new Promise<void>((resolve, reject) => {
          task.on("state_changed", null, reject, async () => {
            currentCertUrl6 = await getDownloadURL(task.snapshot.ref);
            currentCertPath6 = path;
            resolve();
          });
        });
      }

      const newData = {
        whatsapp: (formData.whatsapp || "").replace(/\D/g, "").trim(),
        whatsapp2: (formData.whatsapp2 || "").replace(/\D/g, "").trim(),
        email: (formData.email || "").trim(),
        email2: (formData.email2 || "").trim(),
        address: (formData.address || "").trim(),
        address2: (formData.address2 || "").trim(),
        tiktok: (formData.tiktok || "").trim(),
        facebook: formData.facebook || "",
        instagram: (formData.instagram || "").trim(),
        youtube: (formData.youtube || "").trim(),

        heroCardImage1: currentHeroCardUrl1,
        heroCardStoragePath1: currentHeroCardPath1,
        heroCardImage2: currentHeroCardUrl2,
        heroCardStoragePath2: currentHeroCardPath2,
        heroCardImage3: currentHeroCardUrl3,
        heroCardStoragePath3: currentHeroCardPath3,
        heroBgImage: currentHeroBgUrl,
        heroBgStoragePath: currentHeroBgPath,
        logoUrl: currentLogoUrl,
        logoStoragePath: currentLogoPath,
        aboutImageUrl1: currentAboutUrl1,
        aboutStoragePath1: currentAboutPath1,
        locationImage: currentLocationUrl,
        locationStoragePath: currentLocationPath,

        certImage1: currentCertUrl1,
        certStoragePath1: currentCertPath1,
        certTitle1: formData.certTitle1 || "",
        certImage2: currentCertUrl2,
        certStoragePath2: currentCertPath2,
        certTitle2: formData.certTitle2 || "",
        certImage3: currentCertUrl3,
        certStoragePath3: currentCertPath3,
        certTitle3: formData.certTitle3 || "",
        certImage4: currentCertUrl4,
        certStoragePath4: currentCertPath4,
        certTitle4: formData.certTitle4 || "",
        certImage5: currentCertUrl5,
        certStoragePath5: currentCertPath5,
        certTitle5: formData.certTitle5 || "",
        certImage6: currentCertUrl6,
        certStoragePath6: currentCertPath6,
        certTitle6: formData.certTitle6 || "",
        updatedAt: new Date(),
      };

      await setDoc(docRef, newData);
      setFormData(newData as CompanyInfo);
      setHeroCardFile1(null);
      setHeroCardFile2(null);
      setHeroCardFile3(null);
      if (heroCardInputRef1.current) heroCardInputRef1.current.value = "";
      if (heroCardInputRef2.current) heroCardInputRef2.current.value = "";
      if (heroCardInputRef3.current) heroCardInputRef3.current.value = "";
      setLogoFile(null);
      setAboutFile1(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (aboutInputRef1.current) aboutInputRef1.current.value = "";
      setLocationFile(null);
      if (locationInputRef.current) locationInputRef.current.value = "";

      setCertFile1(null);
      setCertFile2(null);
      setCertFile3(null);
      setCertFile4(null);
      setCertFile5(null);
      setCertFile6(null);
      if (certInputRef1.current) certInputRef1.current.value = "";
      if (certInputRef2.current) certInputRef2.current.value = "";
      if (certInputRef3.current) certInputRef3.current.value = "";
      if (certInputRef4.current) certInputRef4.current.value = "";
      if (certInputRef5.current) certInputRef5.current.value = "";
      if (certInputRef6.current) certInputRef6.current.value = "";
      setSuccess(true);
    } catch (err: any) {
      console.error("Error al guardar configuraciones:", err);
      setError("No se pudieron guardar los cambios en la base de datos.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-stone-200">
        <Loader2 className="animate-spin text-primary-brand mr-2" size={24} />
        <span className="text-stone-500 text-sm">Cargando datos de la empresa...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6 w-full">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <Settings className="text-primary-brand" size={22} />
          <h2 className="text-xl font-bold text-stone-850">Información de la Empresa</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center space-x-2 text-sm">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
            <span>Configuración actualizada con éxito. Los cambios se reflejarán en la web pública.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 flex items-center space-x-2 text-sm">
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Images group */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">
            Imágenes del Sitio
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">



            {/* Hero Background Image */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase block">Fondo del Hero (Principal)</label>
              {formData.heroBgImage && !heroBgFile && (
                <div className="mb-3 aspect-video w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                  <NextImage src={formData.heroBgImage} alt="Hero Background" fill sizes="150px" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <input type="file" accept="image/*" ref={heroBgInputRef} onChange={handleHeroBgChange} className="hidden" id="herobg-image-upload" />
                <label htmlFor="herobg-image-upload" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                  <Upload size={14} /><span>Cambiar Fondo</span>
                </label>
                <span className="text-xs text-stone-500 truncate max-w-xs">{heroBgFile ? heroBgFile.name : formData.heroBgImage ? "" : "Ninguna seleccionada"}</span>
              </div>
            </div>

            {/* Hero Card Image 1 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase block">Tarjeta Hero 1 (Izquierda)</label>
              {formData.heroCardImage1 && !heroCardFile1 && (
                <div className="mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                  <NextImage src={formData.heroCardImage1} alt="Hero Card 1" fill sizes="150px" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <input type="file" accept="image/*" ref={heroCardInputRef1} onChange={handleHeroCardChange1} className="hidden" id="herocard-image-upload-1" />
                <label htmlFor="herocard-image-upload-1" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                  <Upload size={14} /><span>Cambiar Imagen 1</span>
                </label>
                <span className="text-xs text-stone-500 truncate max-w-xs">{heroCardFile1 ? heroCardFile1.name : formData.heroCardImage1 ? "" : "Ninguna seleccionada"}</span>
              </div>
            </div>

            {/* Hero Card Image 2 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase block">Tarjeta Hero 2 (Centro)</label>
              {formData.heroCardImage2 && !heroCardFile2 && (
                <div className="mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                  <NextImage src={formData.heroCardImage2} alt="Hero Card 2" fill sizes="150px" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <input type="file" accept="image/*" ref={heroCardInputRef2} onChange={handleHeroCardChange2} className="hidden" id="herocard-image-upload-2" />
                <label htmlFor="herocard-image-upload-2" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                  <Upload size={14} /><span>Cambiar Imagen 2</span>
                </label>
                <span className="text-xs text-stone-500 truncate max-w-xs">{heroCardFile2 ? heroCardFile2.name : formData.heroCardImage2 ? "" : "Ninguna seleccionada"}</span>
              </div>
            </div>

            {/* Hero Card Image 3 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase block">Tarjeta Hero 3 (Derecha)</label>
              {formData.heroCardImage3 && !heroCardFile3 && (
                <div className="mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                  <NextImage src={formData.heroCardImage3} alt="Hero Card 3" fill sizes="150px" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <input type="file" accept="image/*" ref={heroCardInputRef3} onChange={handleHeroCardChange3} className="hidden" id="herocard-image-upload-3" />
                <label htmlFor="herocard-image-upload-3" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                  <Upload size={14} /><span>Cambiar Imagen 3</span>
                </label>
                <span className="text-xs text-stone-500 truncate max-w-xs">{heroCardFile3 ? heroCardFile3.name : formData.heroCardImage3 ? "" : "Ninguna seleccionada"}</span>
              </div>
            </div>

            {/* About Us Image 1 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase block">
                Imagen de Quiénes Somos (Fondo)
              </label>
              {formData.aboutImageUrl1 && !aboutFile1 && (
                <div className="mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                  <NextImage src={formData.aboutImageUrl1} alt="Nosotros actual 1" fill sizes="150px" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={aboutInputRef1}
                  onChange={handleAboutChange1}
                  className="hidden"
                  id="about-image-upload-1"
                />
                <label
                  htmlFor="about-image-upload-1"
                  className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full"
                >
                  <Upload size={14} />
                  <span>Cambiar Imagen Fondo</span>
                </label>
                <span className="text-xs text-stone-500 truncate max-w-xs">
                  {aboutFile1 ? aboutFile1.name : formData.aboutImageUrl1 ? "" : "Usar imagen por defecto"}
                </span>
              </div>
            </div>

            {/* Location Image */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase block">
                Imagen del Local (Contacto)
              </label>
              {formData.locationImage && !locationFile && (
                <div className="mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                  <NextImage src={formData.locationImage} alt="Local" fill sizes="150px" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <input type="file" accept="image/*" ref={locationInputRef} onChange={handleLocationChange} className="hidden" id="location-image-upload" />
                <label htmlFor="location-image-upload" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                  <Upload size={14} /><span>Cambiar Imagen Local</span>
                </label>
                <span className="text-xs text-stone-500 truncate max-w-xs">{locationFile ? locationFile.name : formData.locationImage ? "" : "Ninguna seleccionada"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications group */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">
            Certificaciones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            {/* Cert 1 */}
            <div className="space-y-3">
              {formData.certImage1 && !certFile1 && (
                <div className="mt-2 mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                  <NextImage src={formData.certImage1} alt="Certificación 1" fill sizes="150px" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col space-y-2 mt-2">
                <input type="file" accept="image/*" ref={certInputRef1} onChange={handleCertChange1} className="hidden" id="cert-image-upload-1" />
                <label htmlFor="cert-image-upload-1" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                  <Upload size={14} /><span>Cambiar Imagen 1</span>
                </label>
              </div>
            </div>

            {/* Cert 2 */}
            {visibleCertsCount >= 2 && (
              <div className="space-y-3">
                {formData.certImage2 && !certFile2 && (
                  <div className="mt-2 mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                    <NextImage src={formData.certImage2} alt="Certificación 2" fill sizes="150px" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col space-y-2 mt-2">
                  <input type="file" accept="image/*" ref={certInputRef2} onChange={handleCertChange2} className="hidden" id="cert-image-upload-2" />
                  <label htmlFor="cert-image-upload-2" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                    <Upload size={14} /><span>Cambiar Imagen 2</span>
                  </label>
                </div>
              </div>
            )}

            {/* Cert 3 */}
            {visibleCertsCount >= 3 && (
              <div className="space-y-3">
                {formData.certImage3 && !certFile3 && (
                  <div className="mt-2 mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                    <NextImage src={formData.certImage3} alt="Certificación 3" fill sizes="150px" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col space-y-2 mt-2">
                  <input type="file" accept="image/*" ref={certInputRef3} onChange={handleCertChange3} className="hidden" id="cert-image-upload-3" />
                  <label htmlFor="cert-image-upload-3" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                    <Upload size={14} /><span>Cambiar Imagen 3</span>
                  </label>
                </div>
              </div>
            )}

            {/* Cert 4 */}
            {visibleCertsCount >= 4 && (
              <div className="space-y-3">
                {formData.certImage4 && !certFile4 && (
                  <div className="mt-2 mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                    <NextImage src={formData.certImage4} alt="Certificación 4" fill sizes="150px" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col space-y-2 mt-2">
                  <input type="file" accept="image/*" ref={certInputRef4} onChange={handleCertChange4} className="hidden" id="cert-image-upload-4" />
                  <label htmlFor="cert-image-upload-4" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                    <Upload size={14} /><span>Cambiar Imagen 4</span>
                  </label>
                </div>
              </div>
            )}

            {/* Cert 5 */}
            {visibleCertsCount >= 5 && (
              <div className="space-y-3">
                {formData.certImage5 && !certFile5 && (
                  <div className="mt-2 mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                    <NextImage src={formData.certImage5} alt="Certificación 5" fill sizes="150px" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col space-y-2 mt-2">
                  <input type="file" accept="image/*" ref={certInputRef5} onChange={handleCertChange5} className="hidden" id="cert-image-upload-5" />
                  <label htmlFor="cert-image-upload-5" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                    <Upload size={14} /><span>Cambiar Imagen 5</span>
                  </label>
                </div>
              </div>
            )}

            {/* Cert 6 */}
            {visibleCertsCount >= 6 && (
              <div className="space-y-3">
                {formData.certImage6 && !certFile6 && (
                  <div className="mt-2 mb-3 aspect-square w-full h-auto rounded-xl overflow-hidden border border-stone-200 relative">
                    <NextImage src={formData.certImage6} alt="Certificación 6" fill sizes="150px" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col space-y-2 mt-2">
                  <input type="file" accept="image/*" ref={certInputRef6} onChange={handleCertChange6} className="hidden" id="cert-image-upload-6" />
                  <label htmlFor="cert-image-upload-6" className="inline-flex items-center justify-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs w-full">
                    <Upload size={14} /><span>Cambiar Imagen 6</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {visibleCertsCount < 6 && (
            <div className="flex justify-center mt-2 pt-4">
              <button
                type="button"
                onClick={() => setVisibleCertsCount(prev => Math.min(prev + 1, 6))}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-brand hover:text-primary-brand-light transition-colors bg-primary-brand/5 hover:bg-primary-brand/10 px-4 py-2.5 rounded-xl border border-primary-brand/20"
              >
                <span>+ Agregar otra certificación</span>
              </button>
            </div>
          )}
        </div>

        {/* Contact info group */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">
            Datos de Contacto
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">WhatsApp Principal</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="Ej: 51915233460"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">WhatsApp Secundario</label>
              <input
                type="text"
                name="whatsapp2"
                value={formData.whatsapp2 || ""}
                onChange={handleChange}
                placeholder="Ej: 51987654321"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Correo Principal</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contacto@empresa.com"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Correo Secundario</label>
              <input
                type="email"
                name="email2"
                value={formData.email2 || ""}
                onChange={handleChange}
                placeholder="Opcional"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Dirección Principal</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej: Av. Principal 123, Satipo"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Link de Maps</label>
              <input
                type="text"
                name="address2"
                value={formData.address2 || ""}
                onChange={handleChange}
                placeholder="Opcional"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social networks group */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">
            Redes Sociales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Enlace de Facebook</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/pagina-oficial"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Enlace de TikTok</label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
                placeholder="https://tiktok.com/@usuario"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Enlace de Instagram</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/usuario"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase">Enlace de YouTube</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube || ""}
                onChange={handleChange}
                placeholder="https://youtube.com/@canal"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
              />
            </div>


          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center items-center space-x-2 bg-primary-brand hover:bg-primary-brand-light text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-xs"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              <span>Guardando Cambios...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
