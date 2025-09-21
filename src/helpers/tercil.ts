import { Component } from "src/project/entities/project.entity";

export function tercil(value: number): Component {
    const v = value || 0;
    if (Number(v) < 0.34) return {
        label: 'MALO',
        value: Number(v),
        color: '#fc0345',
    };
    if (Number(v) < 0.67) return {
        label: 'REGULAR',
        value: Number(v),
        color: '#cdb61a',
    };
    return {
        label: 'BUENO',
        value: Number(v),
        color: '#1acd46',
    };
}