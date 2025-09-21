export class CreateActivityDto {
    area: string[];
    parrishId: string;
    date: Date;
    ente: string[]
    type: 'estadal' | 'municipal';
    name?: string;
}

export type Areas = 'finanzas' | 'economico' | 'obras_servicios' | 'social' | 'salud_educacion' | 'seguridad' | 'politico' | 'nacional';
export const AREAS = ['finanzas', 'economico', 'obras_servicios', 'social', 'salud_educacion', 'seguridad', 'politico', 'nacional'];