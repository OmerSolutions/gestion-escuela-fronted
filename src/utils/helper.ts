// Utilidades helper generales
export const helpers = {
    // Generar ID único temporal
    generateTempId: (): string => {
        return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Debounce para búsquedas
    debounce: <T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): ((...args: Parameters<T>) => void) => {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    // Ordenar array por propiedad
    sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    },

    // Filtrar array por múltiples criterios
    filterBy: <T>(
        array: T[],
        filters: Partial<Record<keyof T, any>>
    ): T[] => {
        return array.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === undefined || value === null || value === '') return true;
                const itemValue = item[key as keyof T];

                if (typeof itemValue === 'string' && typeof value === 'string') {
                    return itemValue.toLowerCase().includes(value.toLowerCase());
                }

                return itemValue === value;
            });
        });
    },

    // Agrupar array por propiedad
    groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
        return array.reduce((groups, item) => {
            const groupKey = String(item[key]);
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        }, {} as Record<string, T[]>);
    },

    // Obtener valores únicos de un array
    getUniqueValues: <T, K extends keyof T>(array: T[], key: K): T[K][] => {
        return [...new Set(array.map(item => item[key]))];
    },

    // Calcular paginación
    calculatePagination: (currentPage: number, totalItems: number, itemsPerPage: number) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        return {
            currentPage,
            totalPages,
            totalItems,
            itemsPerPage,
            startIndex,
            endIndex,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        };
    },

    // Convertir archivo a base64
    fileToBase64: (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    },

    // Descargar archivo
    downloadFile: (blob: Blob, filename: string): void => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    // Copiar texto al portapapeles
    copyToClipboard: async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Error al copiar al portapapeles:', error);
            return false;
        }
    },

    // Formatear tamaño de archivo
    formatFileSize: (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Generar color aleatorio para avatares
    generateAvatarColor: (text: string): string => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];

        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    },

    // Obtener iniciales de nombre
    getInitials: (firstName: string, lastName: string): string => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    },
};