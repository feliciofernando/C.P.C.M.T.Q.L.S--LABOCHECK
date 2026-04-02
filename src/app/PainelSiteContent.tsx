'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  MessageSquare,
  Calendar,
  Scale,
  HelpCircle,
  FolderOpen,
  Users,
  Building2,
  Newspaper,
  RefreshCw,
} from 'lucide-react';

/* ==============================
   TYPES
   ============================== */

interface DirectorMessage {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  authorName: string;
  authorPosition: string;
  isActive: boolean;
  createdAt: string;
}

interface Evento {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  displayDate: string;
  location: string;
  type: string;
  isActive: boolean;
}

interface Legislacao {
  id: string;
  title: string;
  description: string;
  category: string;
  isActive: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

interface Documento {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  fileUrl: string;
  isActive: boolean;
}

interface Director {
  id: string;
  name: string;
  position: string;
  description: string;
  photoUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface SiteSection {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
  icon: string;
  isActive: boolean;
}

interface Noticia {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tag: string;
  newsDate: string;
  displayDate: string;
  isHighlighted: boolean;
  isActive: boolean;
}

interface SectionConfig {
  key: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  apiBase: string;
  isSingle: boolean;
}

/* ==============================
   SECTION CONFIGURATION
   ============================== */

const SECTIONS: SectionConfig[] = [
  { key: 'director', label: 'Mensagem do Director', shortLabel: 'Director', icon: <MessageSquare className="w-4 h-4" />, apiBase: '/api/site/director-message', isSingle: true },
  { key: 'eventos', label: 'Eventos', shortLabel: 'Eventos', icon: <Calendar className="w-4 h-4" />, apiBase: '/api/site/eventos', isSingle: false },
  { key: 'legislacao', label: 'Legislação', shortLabel: 'Legislação', icon: <Scale className="w-4 h-4" />, apiBase: '/api/site/legislacao', isSingle: false },
  { key: 'faqs', label: 'Perguntas Frequentes', shortLabel: 'FAQs', icon: <HelpCircle className="w-4 h-4" />, apiBase: '/api/site/faqs', isSingle: false },
  { key: 'documentos', label: 'Documentos', shortLabel: 'Documentos', icon: <FolderOpen className="w-4 h-4" />, apiBase: '/api/site/documentos', isSingle: false },
  { key: 'directores', label: 'Directores', shortLabel: 'Directores', icon: <Users className="w-4 h-4" />, apiBase: '/api/site/directores', isSingle: false },
  { key: 'sections', label: 'Seções (Sobre)', shortLabel: 'Seções', icon: <Building2 className="w-4 h-4" />, apiBase: '/api/site/sections', isSingle: false },
  { key: 'noticias', label: 'Notícias', shortLabel: 'Notícias', icon: <Newspaper className="w-4 h-4" />, apiBase: '/api/site/noticias', isSingle: false },
];

/* ==============================
   EMPTY FORM STATES
   ============================== */

const emptyDirector: Omit<DirectorMessage, 'id' | 'createdAt'> = {
  title: '', subtitle: '', content: '', authorName: '', authorPosition: '', isActive: true,
};
const emptyEvento: Omit<Evento, 'id'> = {
  title: '', description: '', eventDate: '', displayDate: '', location: '', type: '', isActive: true,
};
const emptyLegislacao: Omit<Legislacao, 'id'> = {
  title: '', description: '', category: '', isActive: true,
};
const emptyFAQ: Omit<FAQ, 'id'> = {
  question: '', answer: '', sortOrder: 0, isActive: true,
};
const emptyDocumento: Omit<Documento, 'id'> = {
  title: '', description: '', category: '', icon: '', fileUrl: '', isActive: true,
};
const emptyDirectorItem: Omit<Director, 'id'> = {
  name: '', position: '', description: '', photoUrl: '', sortOrder: 0, isActive: true,
};
const emptySection: Omit<SiteSection, 'id'> = {
  sectionKey: '', title: '', content: '', icon: '', isActive: true,
};
const emptyNoticia: Omit<Noticia, 'id'> = {
  title: '', content: '', excerpt: '', tag: '', newsDate: '', displayDate: '', isHighlighted: false, isActive: true,
};

/* ==============================
   MAIN COMPONENT
   ============================== */

export default function PainelSiteContent() {
  const [activeSection, setActiveSection] = useState('director');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Director message (single object)
  const [directorMessage, setDirectorMessage] = useState<DirectorMessage | null>(null);
  const [directorForm, setDirectorForm] = useState(emptyDirector);
  const [directorEditing, setDirectorEditing] = useState(false);

  // List sections
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  /* ==============================
     FETCH DATA
     ============================== */

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeSection === 'director') {
        const res = await fetch('/api/site/director-message');
        if (res.ok) {
          const data = await res.json();
          setDirectorMessage(data);
        }
      } else {
        const section = SECTIONS.find(s => s.key === activeSection);
        if (!section) return;
        const res = await fetch(`${section.apiBase}?all=true`);
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        }
      }
    } catch {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  useEffect(() => {
    fetchData();
    // Reset form state when switching sections
    setShowForm(false);
    setEditingItem(null);
    setDirectorEditing(false);
  }, [fetchData]);

  /* ==============================
     GENERIC CRUD: SAVE (CREATE / UPDATE)
     ============================== */

  const handleSave = async () => {
    const section = SECTIONS.find(s => s.key === activeSection);
    if (!section) return;

    setSaving(true);
    try {
      let res: Response;

      if (activeSection === 'director') {
        // Director message: POST for new, PUT (id in body) for update
        if (directorEditing && directorMessage) {
          res = await fetch('/api/site/director-message', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: directorMessage.id, ...directorForm }),
          });
        } else {
          res = await fetch('/api/site/director-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(directorForm),
          });
        }
      } else if (editingItem) {
        // Update: PUT to /api/site/[section]/[id]
        res = await fetch(`${section.apiBase}/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Create: POST to /api/site/[section]
        res = await fetch(section.apiBase, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erro ao guardar');
      }

      toast.success('Guardado com sucesso!');
      setShowForm(false);
      setEditingItem(null);
      setDirectorEditing(false);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao guardar';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  /* ==============================
     GENERIC CRUD: DELETE
     ============================== */

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar "${label}"? Esta acção não pode ser desfeita.`)) return;

    const section = SECTIONS.find(s => s.key === activeSection);
    if (!section || section.isSingle) return;

    try {
      const res = await fetch(`${section.apiBase}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao eliminar');
      toast.success('Eliminado com sucesso!');
      fetchData();
    } catch {
      toast.error('Erro ao eliminar');
    }
  };

  /* ==============================
     GENERIC CRUD: TOGGLE ACTIVE
     ============================== */

  const handleToggleActive = async (item: any) => {
    const section = SECTIONS.find(s => s.key === activeSection);
    if (!section) return;

    const newActive = !item.isActive;

    try {
      let res: Response;
      if (activeSection === 'director') {
        res = await fetch('/api/site/director-message', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, isActive: newActive }),
        });
      } else {
        res = await fetch(`${section.apiBase}/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: newActive }),
        });
      }

      if (!res.ok) throw new Error('Erro ao alterar estado');
      toast.success(newActive ? 'Activado com sucesso!' : 'Desactivado com sucesso!');
      fetchData();
    } catch {
      toast.error('Erro ao alterar estado');
    }
  };

  /* ==============================
     FORM HELPERS
     ============================== */

  const cancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setDirectorEditing(false);
  };

  const startEditDirector = () => {
    if (directorMessage) {
      setDirectorForm({
        title: directorMessage.title,
        subtitle: directorMessage.subtitle,
        content: directorMessage.content,
        authorName: directorMessage.authorName,
        authorPosition: directorMessage.authorPosition,
        isActive: directorMessage.isActive,
      });
      setDirectorEditing(true);
    }
  };

  const startAddDirector = () => {
    setDirectorForm(emptyDirector);
    setDirectorEditing(true);
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const startAdd = () => {
    setEditingItem(null);
    const empty = getEmptyForm(activeSection);
    setFormData(empty);
    setShowForm(true);
  };

  const getEmptyForm = (key: string): any => {
    switch (key) {
      case 'eventos': return { ...emptyEvento };
      case 'legislacao': return { ...emptyLegislacao };
      case 'faqs': return { ...emptyFAQ };
      case 'documentos': return { ...emptyDocumento };
      case 'directores': return { ...emptyDirectorItem };
      case 'sections': return { ...emptySection };
      case 'noticias': return { ...emptyNoticia };
      default: return {};
    }
  };

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /* ==============================
     RENDER: ACTIVE STATUS BADGE
     ============================== */

  const ActiveBadge = ({ isActive }: { isActive: boolean }) => (
    <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-[#1a5c2e] text-white' : 'bg-gray-200 text-gray-600'}>
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  );

  /* ==============================
     RENDER: ACTION BUTTONS (generic)
     ============================== */

  const ActionButtons = ({ item, label, onEdit }: { item: any; label: string; onEdit: () => void }) => (
    <div className="flex items-center gap-1 shrink-0">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} title="Editar">
        <Pencil className="w-4 h-4 text-[#1a5c2e]" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(item)} title={item.isActive ? 'Desactivar' : 'Activar'}>
        {item.isActive ? <EyeOff className="w-4 h-4 text-orange-500" /> : <Eye className="w-4 h-4 text-[#1a5c2e]" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id, label)} title="Eliminar">
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );

  /* ==============================
     RENDER: SECTION HEADER
     ============================== */

  const SectionHeader = ({ title, onAdd }: { title: string; onAdd: () => void }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-[#1a1a1a]">{title}</h2>
      <Button onClick={onAdd} className="bg-[#1a5c2e] hover:bg-[#1a5c2e]/90 text-white text-sm gap-1.5">
        <Plus className="w-4 h-4" /> Adicionar
      </Button>
    </div>
  );

  /* ==============================
     RENDER: FORM CARD WRAPPER
     ============================== */

  const FormCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="border-[#d1d1cc] shadow-sm mb-4">
      <CardHeader className="bg-[#1a5c2e] text-white py-3 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={cancelForm} className="text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {children}
      </CardContent>
    </Card>
  );

  const SaveCancelButtons = () => (
    <div className="flex gap-2 mt-4">
      <Button onClick={handleSave} disabled={saving} className="bg-[#1a5c2e] hover:bg-[#1a5c2e]/90 text-white text-sm gap-1.5">
        <Save className="w-4 h-4" /> {saving ? 'A guardar...' : 'Guardar'}
      </Button>
      <Button variant="outline" onClick={cancelForm} className="text-sm">Cancelar</Button>
    </div>
  );

  /* ==============================
     RENDER: TAB NAVIGATION
     ============================== */

  const renderTabNav = () => (
    <div className="flex overflow-x-auto gap-1 mb-6 pb-1 scrollbar-thin">
      {SECTIONS.map(section => (
        <button
          key={section.key}
          onClick={() => setActiveSection(section.key)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
            activeSection === section.key
              ? 'bg-[#1a5c2e] text-white shadow-sm'
              : 'bg-white text-[#6b6b6b] hover:bg-gray-100 border border-[#d1d1cc]'
          }`}
        >
          {section.icon}
          <span className="hidden sm:inline">{section.label}</span>
          <span className="sm:hidden">{section.shortLabel}</span>
        </button>
      ))}
    </div>
  );

  /* ==============================
     RENDER: DIRECTOR MESSAGE SECTION
     ============================== */

  const renderDirectorSection = () => {
    if (loading) {
      return <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>;
    }

    return (
      <div className="space-y-4">
        <SectionHeader
          title="Mensagem do Director"
          onAdd={startAddDirector}
        />

        {directorEditing ? (
          <FormCard title={directorMessage ? 'Editar Mensagem' : 'Nova Mensagem'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Título</label>
                <Input value={directorForm.title} onChange={e => setDirectorForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Subtítulo</label>
                <Input value={directorForm.subtitle} onChange={e => setDirectorForm(p => ({ ...p, subtitle: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Nome do Autor</label>
                <Input value={directorForm.authorName} onChange={e => setDirectorForm(p => ({ ...p, authorName: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Cargo do Autor</label>
                <Input value={directorForm.authorPosition} onChange={e => setDirectorForm(p => ({ ...p, authorPosition: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Conteúdo</label>
              <Textarea value={directorForm.content} onChange={e => setDirectorForm(p => ({ ...p, content: e.target.value }))} rows={8} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" id="dir-active" checked={directorForm.isActive} onChange={e => setDirectorForm(p => ({ ...p, isActive: e.target.checked }))} className="rounded" />
              <label htmlFor="dir-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
            </div>
            <SaveCancelButtons />
          </FormCard>
        ) : directorMessage ? (
          <Card className="border-[#d1d1cc] shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-[#1a1a1a]">{directorMessage.title}</h3>
                    <ActiveBadge isActive={directorMessage.isActive} />
                  </div>
                  {directorMessage.subtitle && (
                    <p className="text-xs text-[#6b6b6b] mt-1 italic">{directorMessage.subtitle}</p>
                  )}
                  <p className="text-xs text-[#6b6b6b] mt-2 line-clamp-4 whitespace-pre-wrap">{directorMessage.content}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-[#6b6b6b]">
                    <span className="font-semibold text-[#1a5c2e]">{directorMessage.authorName}</span>
                    <span>{directorMessage.authorPosition}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={startEditDirector} title="Editar">
                    <Pencil className="w-4 h-4 text-[#1a5c2e]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(directorMessage)} title={directorMessage.isActive ? 'Desactivar' : 'Activar'}>
                    {directorMessage.isActive ? <EyeOff className="w-4 h-4 text-orange-500" /> : <Eye className="w-4 h-4 text-[#1a5c2e]" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-[#d1d1cc] shadow-sm">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
              <p className="text-[#6b6b6b] text-sm">Nenhuma mensagem do director registada.</p>
              <p className="text-[#d1d1cc] text-xs mt-1">Clique em &quot;Adicionar&quot; para criar a primeira mensagem.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  /* ==============================
     RENDER: EVENTOS SECTION
     ============================== */

  const renderEventosSection = () => (
    <div className="space-y-4">
      <SectionHeader title="Eventos" onAdd={startAdd} />
      {showForm || editingItem ? (
        <FormCard title={editingItem ? 'Editar Evento' : 'Adicionar Evento'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Título</label>
              <Input value={formData.title || ''} onChange={e => updateForm('title', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Tipo</label>
              <Input value={formData.type || ''} onChange={e => updateForm('type', e.target.value)} placeholder="Ex: Conferência, Seminário" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Data do Evento</label>
              <Input type="date" value={formData.eventDate || ''} onChange={e => updateForm('eventDate', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Data de Exibição</label>
              <Input type="text" value={formData.displayDate || ''} onChange={e => updateForm('displayDate', e.target.value)} placeholder="Ex: 15 de Janeiro de 2025" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Local</label>
              <Input value={formData.location || ''} onChange={e => updateForm('location', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Descrição</label>
              <Textarea value={formData.description || ''} onChange={e => updateForm('description', e.target.value)} rows={4} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="evt-active" checked={formData.isActive ?? true} onChange={e => updateForm('isActive', e.target.checked)} className="rounded" />
            <label htmlFor="evt-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
          </div>
          <SaveCancelButtons />
        </FormCard>
      ) : null}
      {loading ? (
        <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>
      ) : items.length === 0 && !showForm ? (
        <Card className="border-[#d1d1cc] shadow-sm">
          <CardContent className="p-8 text-center">
            <Calendar className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhum evento registado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {(items as Evento[]).map(item => (
            <Card key={item.id} className="border-[#d1d1cc] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-[#1a1a1a] truncate">{item.title}</h3>
                      <ActiveBadge isActive={item.isActive} />
                      {item.type && <Badge variant="outline" className="text-xs">{item.type}</Badge>}
                    </div>
                    <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#6b6b6b]">
                      {item.eventDate && <span>{item.eventDate}</span>}
                      {item.displayDate && <span className="text-[#d4a017]">{item.displayDate}</span>}
                      {item.location && <span>{item.location}</span>}
                    </div>
                  </div>
                  <ActionButtons item={item} label={item.title} onEdit={() => startEdit(item)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /* ==============================
     RENDER: LEGISLAÇÃO SECTION
     ============================== */

  const renderLegislacaoSection = () => (
    <div className="space-y-4">
      <SectionHeader title="Legislação" onAdd={startAdd} />
      {showForm || editingItem ? (
        <FormCard title={editingItem ? 'Editar Legislação' : 'Adicionar Legislação'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Título</label>
              <Input value={formData.title || ''} onChange={e => updateForm('title', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Categoria</label>
              <Input value={formData.category || ''} onChange={e => updateForm('category', e.target.value)} placeholder="Ex: Decreto, Resolução" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Descrição</label>
              <Textarea value={formData.description || ''} onChange={e => updateForm('description', e.target.value)} rows={4} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="leg-active" checked={formData.isActive ?? true} onChange={e => updateForm('isActive', e.target.checked)} className="rounded" />
            <label htmlFor="leg-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
          </div>
          <SaveCancelButtons />
        </FormCard>
      ) : null}
      {loading ? (
        <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>
      ) : items.length === 0 && !showForm ? (
        <Card className="border-[#d1d1cc] shadow-sm">
          <CardContent className="p-8 text-center">
            <Scale className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhuma legislação registada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {(items as Legislacao[]).map(item => (
            <Card key={item.id} className="border-[#d1d1cc] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-[#1a1a1a] truncate">{item.title}</h3>
                      <ActiveBadge isActive={item.isActive} />
                      {item.category && <Badge variant="outline" className="text-xs">{item.category}</Badge>}
                    </div>
                    <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <ActionButtons item={item} label={item.title} onEdit={() => startEdit(item)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /* ==============================
     RENDER: FAQs SECTION
     ============================== */

  const renderFaqsSection = () => (
    <div className="space-y-4">
      <SectionHeader title="Perguntas Frequentes" onAdd={startAdd} />
      {showForm || editingItem ? (
        <FormCard title={editingItem ? 'Editar FAQ' : 'Adicionar FAQ'}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Pergunta</label>
              <Input value={formData.question || ''} onChange={e => updateForm('question', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Resposta</label>
              <Textarea value={formData.answer || ''} onChange={e => updateForm('answer', e.target.value)} rows={6} />
            </div>
            <div className="w-32">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Ordem</label>
              <Input type="number" value={formData.sortOrder ?? 0} onChange={e => updateForm('sortOrder', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="faq-active" checked={formData.isActive ?? true} onChange={e => updateForm('isActive', e.target.checked)} className="rounded" />
            <label htmlFor="faq-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
          </div>
          <SaveCancelButtons />
        </FormCard>
      ) : null}
      {loading ? (
        <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>
      ) : items.length === 0 && !showForm ? (
        <Card className="border-[#d1d1cc] shadow-sm">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhuma FAQ registada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {(items as FAQ[]).map(item => (
            <Card key={item.id} className="border-[#d1d1cc] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs bg-[#1a5c2e]/10 text-[#1a5c2e] border-[#1a5c2e]/30">
                        #{item.sortOrder}
                      </Badge>
                      <h3 className="font-semibold text-sm text-[#1a1a1a]">{item.question}</h3>
                      <ActiveBadge isActive={item.isActive} />
                    </div>
                    <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2">{item.answer}</p>
                  </div>
                  <ActionButtons item={item} label={item.question} onEdit={() => startEdit(item)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /* ==============================
     RENDER: DOCUMENTOS SECTION
     ============================== */

  const renderDocumentosSection = () => (
    <div className="space-y-4">
      <SectionHeader title="Documentos" onAdd={startAdd} />
      {showForm || editingItem ? (
        <FormCard title={editingItem ? 'Editar Documento' : 'Adicionar Documento'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Título</label>
              <Input value={formData.title || ''} onChange={e => updateForm('title', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Categoria</label>
              <Input value={formData.category || ''} onChange={e => updateForm('category', e.target.value)} placeholder="Ex: Formulários, Guias" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Ícone (nome Lucide)</label>
              <Input value={formData.icon || ''} onChange={e => updateForm('icon', e.target.value)} placeholder="Ex: FileText, Download" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">URL do Ficheiro</label>
              <Input value={formData.fileUrl || ''} onChange={e => updateForm('fileUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Descrição</label>
              <Textarea value={formData.description || ''} onChange={e => updateForm('description', e.target.value)} rows={3} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="doc-active" checked={formData.isActive ?? true} onChange={e => updateForm('isActive', e.target.checked)} className="rounded" />
            <label htmlFor="doc-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
          </div>
          <SaveCancelButtons />
        </FormCard>
      ) : null}
      {loading ? (
        <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>
      ) : items.length === 0 && !showForm ? (
        <Card className="border-[#d1d1cc] shadow-sm">
          <CardContent className="p-8 text-center">
            <FolderOpen className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhum documento registado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {(items as Documento[]).map(item => (
            <Card key={item.id} className="border-[#d1d1cc] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-[#1a1a1a] truncate">{item.title}</h3>
                      <ActiveBadge isActive={item.isActive} />
                      {item.category && <Badge variant="outline" className="text-xs">{item.category}</Badge>}
                    </div>
                    <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2">{item.description}</p>
                    {item.fileUrl && (
                      <p className="text-xs text-blue-500 mt-1 truncate">{item.fileUrl}</p>
                    )}
                  </div>
                  <ActionButtons item={item} label={item.title} onEdit={() => startEdit(item)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /* ==============================
     RENDER: DIRECTORES SECTION
     ============================== */

  const renderDirectoresSection = () => (
    <div className="space-y-4">
      <SectionHeader title="Directores" onAdd={startAdd} />
      {showForm || editingItem ? (
        <FormCard title={editingItem ? 'Editar Director' : 'Adicionar Director'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Nome</label>
              <Input value={formData.name || ''} onChange={e => updateForm('name', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Cargo</label>
              <Input value={formData.position || ''} onChange={e => updateForm('position', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Ordem</label>
              <Input type="number" value={formData.sortOrder ?? 0} onChange={e => updateForm('sortOrder', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">URL da Foto</label>
              <Input value={formData.photoUrl || ''} onChange={e => updateForm('photoUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Descrição</label>
              <Textarea value={formData.description || ''} onChange={e => updateForm('description', e.target.value)} rows={4} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="dir-item-active" checked={formData.isActive ?? true} onChange={e => updateForm('isActive', e.target.checked)} className="rounded" />
            <label htmlFor="dir-item-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
          </div>
          <SaveCancelButtons />
        </FormCard>
      ) : null}
      {loading ? (
        <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>
      ) : items.length === 0 && !showForm ? (
        <Card className="border-[#d1d1cc] shadow-sm">
          <CardContent className="p-8 text-center">
            <Users className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhum director registado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {(items as Director[]).map(item => (
            <Card key={item.id} className="border-[#d1d1cc] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#d1d1cc] shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1a5c2e]/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-[#1a5c2e]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm text-[#1a1a1a]">{item.name}</h3>
                        <ActiveBadge isActive={item.isActive} />
                      </div>
                      <p className="text-xs text-[#d4a017] font-medium">{item.position}</p>
                      <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <ActionButtons item={item} label={item.name} onEdit={() => startEdit(item)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /* ==============================
     RENDER: SECTIONS (SOBRE) SECTION
     ============================== */

  const renderSectionsSection = () => (
    <div className="space-y-4">
      <SectionHeader title="Seções (Sobre)" onAdd={startAdd} />
      {showForm || editingItem ? (
        <FormCard title={editingItem ? 'Editar Seção' : 'Adicionar Seção'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Chave da Seção</label>
              <Input value={formData.sectionKey || ''} onChange={e => updateForm('sectionKey', e.target.value)} placeholder="Ex: missao, visao, historia" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Ícone (nome Lucide)</label>
              <Input value={formData.icon || ''} onChange={e => updateForm('icon', e.target.value)} placeholder="Ex: Target, Eye" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Título</label>
              <Input value={formData.title || ''} onChange={e => updateForm('title', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Conteúdo</label>
              <Textarea value={formData.content || ''} onChange={e => updateForm('content', e.target.value)} rows={6} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="sec-active" checked={formData.isActive ?? true} onChange={e => updateForm('isActive', e.target.checked)} className="rounded" />
            <label htmlFor="sec-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
          </div>
          <SaveCancelButtons />
        </FormCard>
      ) : null}
      {loading ? (
        <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>
      ) : items.length === 0 && !showForm ? (
        <Card className="border-[#d1d1cc] shadow-sm">
          <CardContent className="p-8 text-center">
            <Building2 className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhuma seção registada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {(items as SiteSection[]).map(item => (
            <Card key={item.id} className="border-[#d1d1cc] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-[#1a1a1a] truncate">{item.title}</h3>
                      <ActiveBadge isActive={item.isActive} />
                      {item.sectionKey && <Badge variant="outline" className="text-xs font-mono">{item.sectionKey}</Badge>}
                    </div>
                    <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2 whitespace-pre-wrap">{item.content}</p>
                  </div>
                  <ActionButtons item={item} label={item.title} onEdit={() => startEdit(item)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /* ==============================
     RENDER: NOTÍCIAS SECTION
     ============================== */

  const renderNoticiasSection = () => (
    <div className="space-y-4">
      <SectionHeader title="Notícias" onAdd={startAdd} />
      {showForm || editingItem ? (
        <FormCard title={editingItem ? 'Editar Notícia' : 'Adicionar Notícia'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Título</label>
              <Input value={formData.title || ''} onChange={e => updateForm('title', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Data da Notícia</label>
              <Input type="date" value={formData.newsDate || ''} onChange={e => updateForm('newsDate', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Data de Exibição</label>
              <Input type="text" value={formData.displayDate || ''} onChange={e => updateForm('displayDate', e.target.value)} placeholder="Ex: 15 de Janeiro de 2025" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Tag</label>
              <Input value={formData.tag || ''} onChange={e => updateForm('tag', e.target.value)} placeholder="Ex: Destaque, Actualidade" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="news-highlight" checked={formData.isHighlighted ?? false} onChange={e => updateForm('isHighlighted', e.target.checked)} className="rounded" />
              <label htmlFor="news-highlight" className="text-xs font-semibold text-[#1a1a1a]">Destaque</label>
              <input type="checkbox" id="news-active" checked={formData.isActive ?? true} onChange={e => updateForm('isActive', e.target.checked)} className="rounded ml-3" />
              <label htmlFor="news-active" className="text-xs font-semibold text-[#1a1a1a]">Activo</label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Resumo</label>
              <Textarea value={formData.excerpt || ''} onChange={e => updateForm('excerpt', e.target.value)} rows={3} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1a1a1a] mb-1 block">Conteúdo</label>
              <Textarea value={formData.content || ''} onChange={e => updateForm('content', e.target.value)} rows={8} />
            </div>
          </div>
          <SaveCancelButtons />
        </FormCard>
      ) : null}
      {loading ? (
        <p className="text-sm text-[#6b6b6b] py-8 text-center">A carregar...</p>
      ) : items.length === 0 && !showForm ? (
        <Card className="border-[#d1d1cc] shadow-sm">
          <CardContent className="p-8 text-center">
            <Newspaper className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhuma notícia registada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {(items as Noticia[]).map(item => (
            <Card key={item.id} className="border-[#d1d1cc] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-[#1a1a1a] truncate">{item.title}</h3>
                      <ActiveBadge isActive={item.isActive} />
                      {item.isHighlighted && <Badge className="bg-[#d4a017] text-white text-xs">Destaque</Badge>}
                      {item.tag && <Badge variant="outline" className="text-xs">{item.tag}</Badge>}
                    </div>
                    <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2">{item.excerpt || item.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#6b6b6b]">
                      {item.newsDate && <span>{item.newsDate}</span>}
                      {item.displayDate && <span className="text-[#d4a017]">{item.displayDate}</span>}
                    </div>
                  </div>
                  <ActionButtons item={item} label={item.title} onEdit={() => startEdit(item)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  /* ==============================
     RENDER: ACTIVE SECTION
     ============================== */

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'director': return renderDirectorSection();
      case 'eventos': return renderEventosSection();
      case 'legislacao': return renderLegislacaoSection();
      case 'faqs': return renderFaqsSection();
      case 'documentos': return renderDocumentosSection();
      case 'directores': return renderDirectoresSection();
      case 'sections': return renderSectionsSection();
      case 'noticias': return renderNoticiasSection();
      default: return null;
    }
  };

  /* ==============================
     MAIN RENDER
     ============================== */

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1a5c2e] flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Gestão de Conteúdo do Site
        </h2>
        <Button variant="outline" size="sm" onClick={fetchData} className="text-sm gap-1.5">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Tab Navigation */}
      {renderTabNav()}

      {/* Section Content */}
      {renderActiveSection()}
    </div>
  );
}
