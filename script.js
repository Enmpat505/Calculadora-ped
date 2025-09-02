document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcularBtn');
    const medicamentoSelect = document.getElementById('medicamento');
    
    calcularBtn.addEventListener('click', calcularDosis);
    medicamentoSelect.addEventListener('change', mostrarOcultarPresentaciones);
});

// Objeto que almacena los datos de los medicamentos
const medicamentos = {
    amoxicilina: {
        dosisMgKg: 50, // mg por kg de peso
        presentacion: 'Jarabe 250 mg/5 ml',
        concentracionMgMl: 50, // 250mg / 5ml = 50 mg/ml
        gotasMl: 20, // 20 gotas por ml (ejemplo estándar)
        indicaciones: 'Tratamiento de infecciones bacterianas como otitis, faringitis, sinusitis.',
        contraindicaciones: 'Alergia a la penicilina, mononucleosis infecciosa.',
        dosisMaxima: 1000 // mg al día
    },
    paracetamol: {
        dosisMgKg: 15, // mg por kg de peso
        presentaciones: [
            { nombre: 'Jarabe 100 mg/ml', concentracionMgMl: 100 },
            { nombre: 'Jarabe 3.2g/100ml', concentracionMgMl: 32 } // 3.2g = 3200mg / 100ml = 32 mg/ml
        ],
        gotasMl: 20,
        indicaciones: 'Fiebre, dolor leve a moderado.',
        contraindicaciones: 'Enfermedad hepática grave, alergia al paracetamol.',
        dosisMaxima: 75 // mg por kg al día
    },
    ibuprofeno: {
        dosisMgKg: 10, // mg por kg de peso
        presentacion: 'Jarabe 100 mg/5 ml',
        concentracionMgMl: 20, // 100mg / 5ml = 20 mg/ml
        gotasMl: 20,
        indicaciones: 'Fiebre, dolor y inflamación.',
        contraindicaciones: 'Úlcera gástrica, insuficiencia renal grave, asma.',
        dosisMaxima: 40 // mg por kg al día
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
    const medicamentoSeleccionado = document.getElementById('medicamento').value;
    const resultadosDiv = document.getElementById('resultados');

    // Validar que los campos no estén vacíos
    if (isNaN(peso) || medicamentoSeleccionado === "") {
        resultadosDiv.innerHTML = '<p class="warning">Por favor, completa todos los campos.</p>';
        return;
    }

    const medicamento = medicamentos[medicamentoSeleccionado];
    let presentacionInfo = '';
    let concentracionMgMl;

    // Lógica para manejar las diferentes presentaciones del paracetamol
    if (medicamentoSeleccionado === 'paracetamol') {
        const concentracionSeleccionada = parseFloat(document.getElementById('concentracionParacetamol').value);
        const presentacionObj = medicamento.presentaciones.find(p => p.concentracionMgMl === concentracionSeleccionada);
        concentracionMgMl = presentacionObj.concentracionMgMl;
        presentacionInfo = presentacionObj.nombre;
    } else {
        concentracionMgMl = medicamento.concentracionMgMl;
        presentacionInfo = medicamento.presentacion;
    }

    // Cálculo de la dosis total
    const dosisTotalMg = peso * medicamento.dosisMgKg;

    // Conversión a ml y gotas
    const dosisMl = dosisTotalMg / concentracionMgMl;
    const dosisGotas = dosisMl * medicamento.gotasMl;

    // Validación de dosis máxima diaria
    const dosisDiariaMaxima = peso * medicamento.dosisMaxima;

    // Mostrar los resultados
    resultadosDiv.innerHTML = `
        <h2>Resultados para ${medicamentoSeleccionado.charAt(0).toUpperCase() + medicamentoSeleccionado.slice(1)}</h2>
        <p><strong>Dosis recomendada:</strong> ${dosisTotalMg.toFixed(2)} mg</p>
        <p><strong>Cantidad en jarabe (ml):</strong> ${dosisMl.toFixed(2)} ml</p>
        <p><strong>Cantidad en gotas:</strong> ${dosisGotas.toFixed(0)} gotas</p>
        <hr>
        <h3>Información del medicamento</h3>
        <p><strong>Presentación:</strong> ${presentacionInfo}</p>
        <p><strong>Indicaciones:</strong> ${medicamento.indicaciones}</p>
        <p><strong>Contraindicaciones:</strong> ${medicamento.contraindicaciones}</p>
        <p><strong>Dosis máxima diaria:</strong> ${dosisDiariaMaxima.toFixed(2)} mg</p>
    `;

    // Si la dosis calculada excede la dosis máxima recomendada, mostrar una advertencia
    if (dosisTotalMg > dosisDiariaMaxima) {
        resultadosDiv.innerHTML += `<p class="warning">¡Advertencia! La dosis calculada (${dosisTotalMg.toFixed(2)} mg) excede la dosis máxima diaria recomendada.</p>`;
    }
}