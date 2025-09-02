document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcularBtn');
    const medicamentoSelect = document.getElementById('medicamento');
    const edadInput = document.getElementById('edad');
    
    calcularBtn.addEventListener('click', calcularDosis);
    medicamentoSelect.addEventListener('change', () => {
        mostrarOcultarPresentaciones();
        mostrarOcultarCamposSRO();
    });

    function mostrarOcultarCamposSRO() {
        const medicamentoSeleccionado = medicamentoSelect.value;
        const pesoInput = document.getElementById('peso');
        
        if (medicamentoSeleccionado.startsWith('sro')) {
            pesoInput.parentElement.style.display = 'block';
            edadInput.parentElement.style.display = 'block';
        } else {
            pesoInput.parentElement.style.display = 'block';
            edadInput.parentElement.style.display = 'block';
        }
    }
});

// Objeto que almacena los datos de los medicamentos
const medicamentos = {
    // Analgésicos / Antipiréticos
    paracetamol: {
        tipo: 'farmaco',
        dosis: { min: 10, max: 15 }, // mg/kg/dosis
        frecuencia: 'cada 6–8 h',
        presentaciones: [
            { nombre: 'Jarabe 100 mg/ml', concentracionMgMl: 100 },
            { nombre: 'Jarabe 3.2g/100ml', concentracionMgMl: 32 }
        ],
        dosisMaxima: {
            porDia: 60, // mg/kg/día
            dosisIndividual: 4000 // mg/día
        },
        indicaciones: 'Fiebre, dolor leve a moderado.',
        contraindicaciones: 'Enfermedad hepática grave, alergia al paracetamol.'
    },
    ibuprofeno: {
        tipo: 'farmaco',
        dosis: { min: 5, max: 10 },
        frecuencia: 'cada 6–8 h',
        presentaciones: [{ nombre: 'Jarabe 100 mg/5 ml', concentracionMgMl: 20 }],
        dosisMaxima: {
            porDia: 40 // mg/kg/día
        },
        indicaciones: 'Fiebre, dolor y inflamación.',
        contraindicaciones: 'Úlcera gástrica, insuficiencia renal grave, asma.'
    },
    // Antibióticos
    amoxicilina: {
        tipo: 'farmaco',
        dosis: { min: 50, max: 80 }, // mg/kg/día
        frecuencia: 'cada 8–12 h',
        presentaciones: [{ nombre: 'Jarabe 250 mg/5 ml', concentracionMgMl: 50 }],
        indicaciones: 'Infecciones respiratorias.',
        contraindicaciones: 'Alergia a la penicilina, mononucleosis infecciosa.'
    },
    'amoxicilina-clavulanico': {
        tipo: 'farmaco',
        dosis: { min: 40, max: 50 }, // mg/kg/día
        frecuencia: 'cada 8 h',
        presentaciones: [{ nombre: 'Suspensión 400 mg/5ml', concentracionMgMl: 80 }],
        indicaciones: 'Infecciones bacterianas, incluyendo respiratorias y del oído.',
        contraindicaciones: 'Alergia a penicilina, disfunción hepática grave.'
    },
    azitromicina: {
        tipo: 'farmaco',
        dosis: { min: 10, max: 10 }, // mg/kg/día
        frecuencia: 'cada 24 h por 3-5 días',
        presentaciones: [{ nombre: 'Suspensión 200 mg/5 ml', concentracionMgMl: 40 }],
        indicaciones: 'Infecciones bacterianas como otitis media aguda, neumonía.',
        contraindicaciones: 'Alergia a la azitromicina o a otros macrólidos.'
    },
    ceftriaxona: {
        tipo: 'farmaco',
        dosis: { min: 50, max: 75 }, // mg/kg/día
        frecuencia: 'cada 24 h',
        presentaciones: [{ nombre: 'Inyectable 1 g', concentracionMgMl: 200 }], // Suponiendo reconstitución
        dosisMaxima: {
            dosisIndividual: 2000 // mg/día
        },
        indicaciones: 'Infecciones graves del tracto respiratorio, urinario, y sepsis.',
        contraindicaciones: 'Hipersensibilidad a cefalosporinas.'
    },
    metronidazol: {
        tipo: 'farmaco',
        dosis: { min: 15, max: 15 }, // mg/kg/dosis
        frecuencia: 'cada 8 h',
        presentaciones: [{ nombre: 'Suspensión 250 mg/5 ml', concentracionMgMl: 50 }],
        indicaciones: 'Infecciones por protozoarios y bacterias anaerobias.',
        contraindicaciones: 'Hipersensibilidad, primer trimestre del embarazo.'
    },
    // Respiratorios
    'salbutamol-jarabe': {
        tipo: 'farmaco',
        dosis: { min: 0.1, max: 0.15 }, // mg/kg/dosis
        frecuencia: 'cada 8 h',
        presentaciones: [{ nombre: 'Jarabe 2 mg/5 ml', concentracionMgMl: 0.4 }],
        dosisMaxima: {
            dosisIndividual: 2 // mg/dosis
        },
        indicaciones: 'Broncoespasmo reversible.',
        contraindicaciones: 'Hipersensibilidad al salbutamol.'
    },
    'salbutamol-inhalador': {
        tipo: 'informativo',
        indicaciones: 'Niños: 100 mcg/puff, 2 inhalaciones cada 20 min (x 3 dosis), luego cada 4–6 h según respuesta.'
    },
    prednisolona: {
        tipo: 'farmaco',
        dosis: { min: 1, max: 2 }, // mg/kg/día
        frecuencia: 'en una sola toma o dividido cada 12 h',
        presentaciones: [{ nombre: 'Tabletas 5 mg', concentracionMgMl: null }],
        dosisMaxima: {
            dosisIndividual: 60 // mg/día
        },
        indicaciones: 'Enfermedades inflamatorias y autoinmunes.',
        contraindicaciones: 'Infecciones fúngicas sistémicas, hipersensibilidad.'
    },
    dexametasona: {
        tipo: 'farmaco',
        dosis: { min: 0.15, max: 0.6 }, // mg/kg/día
        frecuencia: 'VO o IV',
        presentaciones: [{ nombre: 'Ampolla 4 mg/ml', concentracionMgMl: 4 }],
        dosisMaxima: {
            dosisIndividual: 16 // mg/día
        },
        indicaciones: 'Inflamación, alergias, edema cerebral.',
        contraindicaciones: 'Infección sistémica activa no tratada.'
    },
    // Hidratación Oral (SRO)
    'sro-fase-rehidratacion': {
        tipo: 'sro',
        dosis: { min: 50, max: 100 }, // ml/kg
        duracion: 'primeras 4 horas'
    },
    'sro-fase-mantenimiento-evacuacion': {
        tipo: 'sro',
        dosis: { min: 10, max: 10 }, // ml/kg
        evento: 'por cada evacuación diarreica'
    },
    'sro-fase-mantenimiento-vomito': {
        tipo: 'sro',
        dosis: { min: 2, max: 2 }, // ml/kg
        evento: 'por cada vómito'
    }
};

function mostrarOcultarPresentaciones() {
    const medicamentoSeleccionado = document.getElementById('medicamento').value;
    const presentacionesDiv = document.getElementById('presentacion-paracetamol');

    if (medicamentoSeleccionado === 'paracetamol') {
        presentacionesDiv.style.display = 'block';
    } else {
        presentacionesDiv.style.display = 'none';
    }
}

function calcularDosis() {
    const peso = parseFloat(document.getElementById('peso').value);
    const edad = parseInt(document.getElementById('edad').value, 10);
    const medicamentoSeleccionado = document.getElementById('medicamento').value;
    const resultadosDiv = document.getElementById('resultados');

    if (isNaN(peso) || isNaN(edad) || medicamentoSeleccionado === "") {
        resultadosDiv.innerHTML = '<p class="warning">Por favor, completa todos los campos.</p>';
        return;
    }

    const medicamento = medicamentos[medicamentoSeleccionado];

    if (medicamento.tipo === 'sro') {
        manejarSRO(medicamento, peso, edad, resultadosDiv);
    } else if (medicamento.tipo === 'informativo') {
        manejarInformativo(medicamento, resultadosDiv);
    } else {
        manejarFarmaco(medicamento, peso, resultadosDiv);
    }
}

function manejarFarmaco(medicamento, peso, resultadosDiv) {
    let presentacionInfo = '';
    let concentracionMgMl;
    
    // Asignar nombre del medicamento
    const nombreMedicamento = medicamento.nombre || (medicamento.presentaciones && medicamento.presentaciones[0].nombre) || 'Medicamento';

    if (medicamento.presentaciones && medicamento.presentaciones.length > 1) {
        const concentracionSeleccionada = parseFloat(document.getElementById('concentracionParacetamol').value);
        const presentacionObj = medicamento.presentaciones.find(p => p.concentracionMgMl === concentracionSeleccionada);
        concentracionMgMl = presentacionObj.concentracionMgMl;
        presentacionInfo = presentacionObj.nombre;
    } else if (medicamento.presentaciones && medicamento.presentaciones.length === 1) {
        concentracionMgMl = medicamento.presentaciones[0].concentracionMgMl;
        presentacionInfo = medicamento.presentaciones[0].nombre;
    } else {
        concentracionMgMl = null; // No hay concentración para calcular
        presentacionInfo = 'No disponible';
    }

    // Cálculo de dosis en mg
    const dosisMinMg = peso * medicamento.dosis.min;
    const dosisMaxMg = peso * medicamento.dosis.max;

    let dosisMgTexto;
    if (dosisMinMg === dosisMaxMg) {
        dosisMgTexto = `${dosisMinMg.toFixed(2)} mg`;
    } else {
        dosisMgTexto = `${dosisMinMg.toFixed(2)} - ${dosisMaxMg.toFixed(2)} mg`;
    }

    // Cálculo de dosis en ml y gotas (si aplica)
    let dosisMlTexto = 'No aplica';
    let dosisGotasTexto = 'No aplica';
    if (concentracionMgMl) {
        const dosisMlMin = dosisMinMg / concentracionMgMl;
        const dosisMlMax = dosisMaxMg / concentracionMgMl;

        if (dosisMlMin === dosisMlMax) {
            dosisMlTexto = `${dosisMlMin.toFixed(2)} ml`;
        } else {
            dosisMlTexto = `${dosisMlMin.toFixed(2)} - ${dosisMlMax.toFixed(2)} ml`;
        }

        if (medicamento.gotasMl) {
            const dosisGotasMin = dosisMlMin * medicamento.gotasMl;
            const dosisGotasMax = dosisMlMax * medicamento.gotasMl;
            dosisGotasTexto = `${dosisGotasMin.toFixed(0)} - ${dosisGotasMax.toFixed(0)} gotas`;
        }
    }

    // Lógica para dosis máxima diaria
    let dosisDiariaMaxima = 'No aplica';
    let dosisDiariaWarning = false;
    if (medicamento.dosisMaxima) {
        if (medicamento.dosisMaxima.porDia) {
            dosisDiariaMaxima = (peso * medicamento.dosisMaxima.porDia).toFixed(2) + ' mg/día';
            if (dosisMaxMg * (24 / parseFloat(medicamento.frecuencia.split(' ')[1])) > peso * medicamento.dosisMaxima.porDia) {
                 dosisDiariaWarning = true;
            }
        } else if (medicamento.dosisMaxima.dosisIndividual) {
            dosisDiariaMaxima = medicamento.dosisMaxima.dosisIndividual.toFixed(0) + ' mg/día';
            if (dosisMaxMg > medicamento.dosisMaxima.dosisIndividual) {
                 dosisDiariaWarning = true;
            }
        }
    }

    resultadosDiv.innerHTML = `
        <h2>Resultados para ${nombreMedicamento}</h2>
        <p><strong>Dosis recomendada:</strong></p>
        <ul>
            <li>**Por peso:** ${medicamento.dosis.min} - ${medicamento.dosis.max} mg/kg/dosis</li>
            <li>**Dosis total:** ${dosisMgTexto} cada ${medicamento.frecuencia}</li>
            <li>**Cantidad en jarabe:** ${dosisMlTexto}</li>
        </ul>
        <hr>
        <h3>Información del medicamento</h3>
        <p><strong>Presentación:</strong> ${presentacionInfo}</p>
        <p><strong>Indicaciones:</strong> ${medicamento.indicaciones}</p>
        <p><strong>Contraindicaciones:</strong> ${medicamento.contraindicaciones}</p>
        <p><strong>Dosis máxima diaria:</strong> ${dosisDiariaMaxima}</p>
        ${dosisDiariaWarning ? `<p class="warning">¡Advertencia! La dosis calculada puede exceder la dosis máxima diaria recomendada.</p>` : ''}
    `;
}

function manejarSRO(medicamento, peso, edad, resultadosDiv) {
    let resultadoSRO = '';
    
    if (medicamento.duracion) { // Fase de rehidratación
        const dosisMinMl = peso * medicamento.dosis.min;
        const dosisMaxMl = peso * medicamento.dosis.max;
        resultadoSRO = `<strong>Fase de Rehidratación (primeras 4 horas):</strong> ${dosisMinMl.toFixed(0)} - ${dosisMaxMl.toFixed(0)} ml de SRO.`;
    } else if (medicamento.evento) { // Fase de mantenimiento
        if (edad < 2) {
            resultadoSRO = `<strong>Regla práctica (Menor de 2 años):</strong> Administrar 50 - 100 ml de SRO después de cada evacuación.`;
        } else if (edad >= 2 && edad <= 10) {
            resultadoSRO = `<strong>Regla práctica (2 a 10 años):</strong> Administrar 100 - 200 ml de SRO después de cada evacuación.`;
        } else {
            resultadoSRO = `<strong>Regla práctica (Mayor de 10 años):</strong> Administrar SRO a libre demanda.`;
        }
    }
    
    resultadosDiv.innerHTML = `
        <h2>Guía de Hidratación Oral (SRO)</h2>
        <p>${resultadoSRO}</p>
        <hr>
        <p><strong>Nota:</strong> Esta es una guía general. Siempre consulte a un profesional de la salud.</p>
    `;
}

function manejarInformativo(medicamento, resultadosDiv) {
    resultadosDiv.innerHTML = `
        <h2>Información para ${medicamento.nombre || 'Medicamento'}</h2>
        <p><strong>Indicaciones:</strong> ${medicamento.indicaciones}</p>
    `;
}
