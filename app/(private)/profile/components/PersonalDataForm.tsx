"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Edit3, Save, X, Shield } from 'lucide-react';

export default function PersonalDataForm({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.correo,
    contraseña: user.contraseña
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Datos actualizados con éxito (Estado local)");
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      contraseña: user.contraseña
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Card de Identidad / Cabecera */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-100">
            {formData.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{formData.nombre} {formData.apellido}</h2>
            <p className="text-gray-500 text-sm">{formData.correo}</p>
          </div>
        </div>

        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Edit3 size={16} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} /> Guardar
            </button>
            <button onClick={handleCancel} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 flex items-center gap-2">
              <X size={16} /> Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Card de Campos de Información */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Información Personal</h3>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Nombre */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Nombre</label>
            {isEditing ? (
              <input 
                type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p className="text-gray-900 font-semibold py-2">{formData.nombre}</p>
            )}
          </div>

          {/* Input Apellido */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Apellido</label>
            {isEditing ? (
              <input 
                type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p className="text-gray-900 font-semibold py-2">{formData.apellido}</p>
            )}
          </div>

          {/* Input Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Email</label>
            {isEditing ? (
              <input 
                type="email" name="correo" value={formData.correo} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-gray-700 py-2">
                <Mail size={14} className="text-blue-500" />
                <span className="font-medium">{formData.correo}</span>
              </div>
            )}
          </div>

          {/* Input Contraseña */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Contraseña</label>
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 w-full">
                <Lock size={14} className="text-gray-400" />
                {isEditing ? (
                  <input 
                    type={showPass ? "text" : "password"} name="contraseña" value={formData.contraseña} onChange={handleChange}
                    className="bg-transparent w-full outline-none font-mono text-gray-600"
                  />
                ) : (
                  <span className="font-mono text-gray-600">
                    {showPass ? formData.contraseña : "••••••••••••"}
                  </span>
                )}
              </div>
              <button onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-blue-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Estado de Cuenta */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Estado de Cuenta</label>
            <div className="py-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-green-100 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                {user.estado}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}