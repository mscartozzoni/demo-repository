/**
 * Formata um objeto Date para o formato 'YYYY-MM-DDTHH:mm', compatível com input[type=datetime-local].
 * @param {Date} date O objeto Date a ser formatado.
 * @returns {string} A data formatada.
 */
export const formatLocalDateTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
        return '';
    }
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Converte uma string 'YYYY-MM-DDTHH:mm' para um objeto Date.
 * @param {string} str A string de data/hora local.
 * @returns {Date} O objeto Date correspondente.
 */
export const parseLocalDateTime = (str) => {
    if (!str) return new Date(NaN);
    // Adiciona segundos e Z para garantir que seja interpretado como UTC se a timezone não estiver presente,
    // mas o formato YYYY-MM-DDTHH:mm é inerentemente local. O construtor de Date lida com isso.
    return new Date(str);
};

/**
 * Calcula sugestões de horários inteligentes para um agendamento.
 * @param {object} params Parâmetros para o cálculo.
 * @param {string} params.dateStr Data no formato 'YYYY-MM-DD'.
 * @param {number} params.durationMin Duração da consulta em minutos.
 * @param {Array<object>} params.appointments Lista de agendamentos existentes para o dia.
 * @param {object} params.options Configurações da clínica.
 * @returns {Array<string>} Uma lista de horários sugeridos no formato 'YYYY-MM-DDTHH:mm'.
 */
export const computeSmartSuggestions = ({ dateStr, durationMin, appointments, options }) => {
    const {
        workStartHour = 9,
        workEndHour = 18,
        lunchBreak = { start: '12:00', end: '13:00' },
        slotIncrementMinutes = 15,
        minGapMinutes = 5,
        sameDayLeadMinutes = 60,
    } = options || {};

    const suggestions = [];
    const today = new Date();
    const targetDate = parseLocalDateTime(dateStr + 'T00:00');
    const isToday = targetDate.toDateString() === today.toDateString();

    // Define o início do dia de trabalho
    let searchStart = parseLocalDateTime(`${dateStr}T${String(workStartHour).padStart(2, '0')}:00`);

    // Se for hoje, começa a busca a partir do horário atual + uma margem
    if (isToday) {
        const nowWithLead = new Date(today.getTime() + sameDayLeadMinutes * 60000);
        if (nowWithLead > searchStart) {
            searchStart = nowWithLead;
        }
    }

    // Arredonda o início da busca para o próximo incremento de slot
    const startMinutes = searchStart.getMinutes();
    const remainder = startMinutes % slotIncrementMinutes;
    if (remainder !== 0) {
        searchStart.setMinutes(startMinutes + (slotIncrementMinutes - remainder));
    }

    const workEnd = parseLocalDateTime(`${dateStr}T${String(workEndHour).padStart(2, '0')}:00`);
    const lunchStart = parseLocalDateTime(`${dateStr}T${lunchBreak.start}`);
    const lunchEnd = parseLocalDateTime(`${dateStr}T${lunchBreak.end}`);

    // Mapeia os agendamentos existentes para intervalos de tempo (em milissegundos)
    const existingIntervals = appointments.map(appt => {
        const start = parseLocalDateTime(appt.start_at || appt.appointment_time);
        const end = appt.end_at ? parseLocalDateTime(appt.end_at) : new Date(start.getTime() + 30 * 60000); // Fallback
        return [start.getTime(), end.getTime()];
    });

    // Adiciona o horário de almoço aos intervalos bloqueados
    existingIntervals.push([lunchStart.getTime(), lunchEnd.getTime()]);

    // Itera do início ao fim do dia de trabalho, verificando a disponibilidade
    let currentSlotStart = new Date(searchStart.getTime());

    while (suggestions.length < 5) {
        const currentSlotEnd = new Date(currentSlotStart.getTime() + durationMin * 60000);

        // Para o loop se o slot terminar após o fim do expediente
        if (currentSlotEnd > workEnd) {
            break;
        }

        // Verifica se o slot atual se sobrepõe a algum intervalo existente
        const overlaps = existingIntervals.some(([start, end]) =>
            Math.max(currentSlotStart.getTime(), start) < Math.min(currentSlotEnd.getTime(), end)
        );

        if (!overlaps) {
            suggestions.push(formatLocalDateTime(currentSlotStart));
        }

        // Avança para o próximo slot potencial
        currentSlotStart = new Date(currentSlotStart.getTime() + slotIncrementMinutes * 60000);
    }

    return suggestions;
};