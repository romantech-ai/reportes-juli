import { useState } from 'react';
import {
  ChevronDown,
  FileText,
  MapPin,
  Route,
  Package,
  Star,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Loader2,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { useReportStore } from '@/stores/reportStore';
import { getWeekRangeFromDate, getTodayISO } from '@/lib/utils';
import type { ReportDraft } from '@/types/report';

interface ManualReportFormProps {
  onSuccess?: (reportId: string) => void;
  onCancel?: () => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-amber-600">{icon}</span>
          <span className="font-medium text-stone-900">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-stone-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-stone-200 animate-fade-up">
          {children}
        </div>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

const initialDraft: ReportDraft = {
  transcripcion_original: '',
  portada: {
    zona: '',
    semana: getWeekRangeFromDate(getTodayISO()),
    fecha: getTodayISO(),
    fabricas: [],
    responsable: 'Julián',
    objetivo: '',
  },
  foto_zona: {
    litros_mes: 0,
    fabricas_destino: '',
    peso_estrategico: '',
  },
  rutas: {
    num_rutas: 0,
    litros_medios_ruta: 0,
    distancia_media_km: 0,
    solapes: '',
    eficiencia: '',
  },
  volumenes: {
    volumen_contratado: 0,
    volumen_real: 0,
    pct_contratos_largos: 0,
    concentracion_ganaderos: '',
  },
  calidad: {
    calidad_media: '',
    incidencias: '',
    impacto_estacional: '',
  },
  riesgos: [],
  oportunidades: [],
  cierre_ejecutivo: '',
  notas_adicionales: '',
};

export function ManualReportForm({ onSuccess, onCancel }: ManualReportFormProps) {
  const [draft, setDraft] = useState<ReportDraft>(initialDraft);
  const [fabricaInput, setFabricaInput] = useState('');
  const [riesgoInput, setRiesgoInput] = useState('');
  const [oportunidadInput, setOportunidadInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { addReport } = useReportStore();

  const updateField = <K extends keyof ReportDraft>(
    section: K,
    field: keyof ReportDraft[K],
    value: ReportDraft[K][keyof ReportDraft[K]]
  ) => {
    setDraft((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const handleDateChange = (date: string) => {
    setDraft((prev) => ({
      ...prev,
      portada: {
        ...prev.portada,
        fecha: date,
        semana: getWeekRangeFromDate(date),
      },
    }));
  };

  const addFabrica = () => {
    if (fabricaInput.trim()) {
      setDraft((prev) => ({
        ...prev,
        portada: {
          ...prev.portada,
          fabricas: [...prev.portada.fabricas, fabricaInput.trim()],
        },
      }));
      setFabricaInput('');
    }
  };

  const removeFabrica = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      portada: {
        ...prev.portada,
        fabricas: prev.portada.fabricas.filter((_, i) => i !== index),
      },
    }));
  };

  const addRiesgo = () => {
    if (riesgoInput.trim()) {
      setDraft((prev) => ({
        ...prev,
        riesgos: [...prev.riesgos, riesgoInput.trim()],
      }));
      setRiesgoInput('');
    }
  };

  const removeRiesgo = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      riesgos: prev.riesgos.filter((_, i) => i !== index),
    }));
  };

  const addOportunidad = () => {
    if (oportunidadInput.trim()) {
      setDraft((prev) => ({
        ...prev,
        oportunidades: [...prev.oportunidades, oportunidadInput.trim()],
      }));
      setOportunidadInput('');
    }
  };

  const removeOportunidad = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      oportunidades: prev.oportunidades.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!draft.portada.zona.trim()) {
      alert('Por favor ingresa el nombre de la zona');
      return;
    }

    setIsSaving(true);

    try {
      const report = await addReport(draft);
      onSuccess?.(report.id);
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Error al guardar el reporte');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow text-sm';
  const textareaClass = cn(inputClass, 'min-h-[80px] resize-y');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Portada */}
      <Section
        title="Portada"
        icon={<FileText className="h-5 w-5" />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          <Field label="Zona *">
            <input
              type="text"
              value={draft.portada.zona}
              onChange={(e) => updateField('portada', 'zona', e.target.value)}
              placeholder="Ej: Castilla La Mancha"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Fecha del reporte">
            <DatePicker
              value={draft.portada.fecha}
              onChange={handleDateChange}
            />
            <p className="text-xs text-stone-500 mt-1">
              Semana: {draft.portada.semana}
            </p>
          </Field>

          <Field label="Fábricas">
            <div className="flex gap-2">
              <input
                type="text"
                value={fabricaInput}
                onChange={(e) => setFabricaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFabrica())}
                placeholder="Ej: CSAN"
                className={cn(inputClass, 'flex-1')}
              />
              <Button
                type="button"
                onClick={addFabrica}
                variant="outline"
                className="shrink-0"
              >
                Añadir
              </Button>
            </div>
            {draft.portada.fabricas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {draft.portada.fabricas.map((fab, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-sm rounded-md"
                  >
                    {fab}
                    <button
                      type="button"
                      onClick={() => removeFabrica(idx)}
                      className="hover:text-amber-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Responsable">
            <input
              type="text"
              value={draft.portada.responsable}
              onChange={(e) => updateField('portada', 'responsable', e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Objetivo de la visita">
            <textarea
              value={draft.portada.objetivo}
              onChange={(e) => updateField('portada', 'objetivo', e.target.value)}
              placeholder="Ej: Entender estructura de rutas y evaluar eficiencia"
              className={textareaClass}
            />
          </Field>
        </div>
      </Section>

      {/* Foto de Zona */}
      <Section title="Foto de la Zona" icon={<MapPin className="h-5 w-5" />}>
        <div className="space-y-4">
          <Field label="Litros/mes" hint="Volumen mensual de la zona">
            <input
              type="number"
              value={draft.foto_zona.litros_mes || ''}
              onChange={(e) =>
                updateField('foto_zona', 'litros_mes', Number(e.target.value))
              }
              placeholder="Ej: 500000"
              className={inputClass}
            />
          </Field>

          <Field label="Fábricas destino">
            <input
              type="text"
              value={draft.foto_zona.fabricas_destino}
              onChange={(e) =>
                updateField('foto_zona', 'fabricas_destino', e.target.value)
              }
              placeholder="Ej: CSAN y Jaén"
              className={inputClass}
            />
          </Field>

          <Field label="Peso estratégico">
            <textarea
              value={draft.foto_zona.peso_estrategico}
              onChange={(e) =>
                updateField('foto_zona', 'peso_estrategico', e.target.value)
              }
              placeholder="Ej: Zona crítica en verano por alta demanda"
              className={textareaClass}
            />
          </Field>
        </div>
      </Section>

      {/* Rutas */}
      <Section title="Rutas y Logística" icon={<Route className="h-5 w-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Número de rutas">
              <input
                type="number"
                value={draft.rutas.num_rutas || ''}
                onChange={(e) =>
                  updateField('rutas', 'num_rutas', Number(e.target.value))
                }
                placeholder="Ej: 5"
                className={inputClass}
              />
            </Field>

            <Field label="Litros medios/ruta">
              <input
                type="number"
                value={draft.rutas.litros_medios_ruta || ''}
                onChange={(e) =>
                  updateField('rutas', 'litros_medios_ruta', Number(e.target.value))
                }
                placeholder="Ej: 8000"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Distancia media (km)">
            <input
              type="number"
              value={draft.rutas.distancia_media_km || ''}
              onChange={(e) =>
                updateField('rutas', 'distancia_media_km', Number(e.target.value))
              }
              placeholder="Ej: 45"
              className={inputClass}
            />
          </Field>

          <Field label="Solapes">
            <textarea
              value={draft.rutas.solapes}
              onChange={(e) => updateField('rutas', 'solapes', e.target.value)}
              placeholder="Ej: Solape entre R1 y R3 en zona norte"
              className={textareaClass}
            />
          </Field>

          <Field label="Eficiencia">
            <textarea
              value={draft.rutas.eficiencia}
              onChange={(e) => updateField('rutas', 'eficiencia', e.target.value)}
              placeholder="Ej: 2 rutas con ocupación <80%"
              className={textareaClass}
            />
          </Field>
        </div>
      </Section>

      {/* Volúmenes */}
      <Section title="Volúmenes y Contratos" icon={<Package className="h-5 w-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Volumen contratado">
              <input
                type="number"
                value={draft.volumenes.volumen_contratado || ''}
                onChange={(e) =>
                  updateField('volumenes', 'volumen_contratado', Number(e.target.value))
                }
                placeholder="Litros"
                className={inputClass}
              />
            </Field>

            <Field label="Volumen real">
              <input
                type="number"
                value={draft.volumenes.volumen_real || ''}
                onChange={(e) =>
                  updateField('volumenes', 'volumen_real', Number(e.target.value))
                }
                placeholder="Litros"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="% Contratos largos">
            <input
              type="number"
              value={draft.volumenes.pct_contratos_largos || ''}
              onChange={(e) =>
                updateField('volumenes', 'pct_contratos_largos', Number(e.target.value))
              }
              placeholder="Ej: 65"
              min="0"
              max="100"
              className={inputClass}
            />
          </Field>

          <Field label="Concentración de ganaderos">
            <textarea
              value={draft.volumenes.concentracion_ganaderos}
              onChange={(e) =>
                updateField('volumenes', 'concentracion_ganaderos', e.target.value)
              }
              placeholder="Ej: Top 3 ganaderos representan el 40% del volumen"
              className={textareaClass}
            />
          </Field>
        </div>
      </Section>

      {/* Calidad */}
      <Section title="Calidad" icon={<Star className="h-5 w-5" />}>
        <div className="space-y-4">
          <Field label="Calidad media">
            <input
              type="text"
              value={draft.calidad.calidad_media}
              onChange={(e) =>
                updateField('calidad', 'calidad_media', e.target.value)
              }
              placeholder="Ej: Buena, 95% cumple estándares"
              className={inputClass}
            />
          </Field>

          <Field label="Incidencias">
            <textarea
              value={draft.calidad.incidencias}
              onChange={(e) =>
                updateField('calidad', 'incidencias', e.target.value)
              }
              placeholder="Ej: 2 incidencias de antibióticos este mes"
              className={textareaClass}
            />
          </Field>

          <Field label="Impacto estacional">
            <textarea
              value={draft.calidad.impacto_estacional}
              onChange={(e) =>
                updateField('calidad', 'impacto_estacional', e.target.value)
              }
              placeholder="Ej: Descenso esperado en verano por calor"
              className={textareaClass}
            />
          </Field>
        </div>
      </Section>

      {/* Riesgos */}
      <Section title="Riesgos Detectados" icon={<AlertTriangle className="h-5 w-5" />}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={riesgoInput}
              onChange={(e) => setRiesgoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRiesgo())}
              placeholder="Añadir riesgo..."
              className={cn(inputClass, 'flex-1')}
            />
            <Button
              type="button"
              onClick={addRiesgo}
              variant="outline"
              className="shrink-0"
            >
              Añadir
            </Button>
          </div>
          {draft.riesgos.length > 0 && (
            <ul className="space-y-2">
              {draft.riesgos.map((riesgo, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="flex-1 text-sm text-stone-700">{riesgo}</span>
                  <button
                    type="button"
                    onClick={() => removeRiesgo(idx)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Oportunidades */}
      <Section title="Oportunidades" icon={<Lightbulb className="h-5 w-5" />}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={oportunidadInput}
              onChange={(e) => setOportunidadInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOportunidad())}
              placeholder="Añadir oportunidad..."
              className={cn(inputClass, 'flex-1')}
            />
            <Button
              type="button"
              onClick={addOportunidad}
              variant="outline"
              className="shrink-0"
            >
              Añadir
            </Button>
          </div>
          {draft.oportunidades.length > 0 && (
            <ul className="space-y-2">
              {draft.oportunidades.map((oportunidad, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span className="flex-1 text-sm text-stone-700">{oportunidad}</span>
                  <button
                    type="button"
                    onClick={() => removeOportunidad(idx)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Cierre Ejecutivo */}
      <Section title="Cierre Ejecutivo" icon={<FileCheck className="h-5 w-5" />}>
        <Field label="Resumen ejecutivo">
          <textarea
            value={draft.cierre_ejecutivo}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, cierre_ejecutivo: e.target.value }))
            }
            placeholder="Resumen conciso de los principales hallazgos y conclusiones..."
            className={cn(textareaClass, 'min-h-[120px]')}
          />
        </Field>

        <Field label="Notas adicionales">
          <textarea
            value={draft.notas_adicionales}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, notas_adicionales: e.target.value }))
            }
            placeholder="Notas extra o comentarios..."
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSaving || !draft.portada.zona.trim()}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Reporte
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
