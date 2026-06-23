// La inicialización del tema se realiza en el <head> del HTML para evitar destellos.

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Lógica base de la Calculadora de Riesgo
 */

// Definición de las preguntas
const QUESTIONS = [
    // COMUNICACIÓN
    {
        category: 'COMUNICACIÓN', text: 'En mi empresa y/o equipo se comunican objetivos específicos y fechas de cumplimiento.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'COMUNICACIÓN', text: 'Las reuniones finalizan con tareas, responsables y próximos pasos definidos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'COMUNICACIÓN', text: 'Los colaboradores reciben de manera trimestral feedback claro sobre su desempeño y resultados.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // LIDERAZGO
    {
        category: 'LIDERAZGO', text: 'Los jefes brindan dirección clara a sus equipos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'LIDERAZGO', text: 'Los líderes están disponibles para escuchar problemas o ideas.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'LIDERAZGO', text: 'Los líderes realizan reuniones o conversaciones periódicas para alinear objetivos y seguimiento.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // CLIMA LABORAL
    {
        category: 'CLIMA LABORAL', text: 'En nuestros equipos de trabajo las diferencias o desacuerdos pueden expresarse sin temor a represalias.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'CLIMA LABORAL', text: 'Los logros o aportes de las personas son reconocidos explícitamente dentro del equipo.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // TRABAJO EN EQUIPO
    {
        category: 'TRABAJO EN EQUIPO', text: 'Diversas áreas responden en tiempo y forma cuando se requiere colaboración.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'TRABAJO EN EQUIPO', text: 'Cuando aparecen conflictos, se generan conversaciones para resolverlos y definir acuerdos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // GESTIÓN DE CAMBIO
    {
        category: 'GESTIÓN DE CAMBIO', text: 'Antes de implementar cambios, se comunica qué cambia, por qué y cómo impacta en el trabajo.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'GESTIÓN DE CAMBIO', text: 'Después de un cambio organizacional, los equipos logran reorganizar tareas y funcionamiento en tiempos definidos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    }
];

// Estado de la aplicación
const state = {
    leads: {
        name: '',
        role: '',
        company: '',
        fleetSize: '',
        email: ''
    },
    skippedAuth: false,
    currentQuestionIndex: 0,
    totalPoints: 0,
    answers: [],
    currentEmailSubject: '',
    currentEmailBody: '',
    // URL de Google Apps Script (Reemplazar con la URL generada al implementar el script)
    googleSheetUrl: 'https://script.google.com/macros/s/AKfycbwOp9v-OlWGMuc2ni0gN1PdOA4KzOLpo5e2k9EkiqMGhjntWEDjE0d95w7XqDXqud0K/exec'
};

/**
 * Funciones de Cooldown (Ban temporal por 1 hora)
 */
const WHITELIST_EMAILS = [
    'poloocuello@gmail.com',
    'sergiogustavoderosa@yahoo.com.ar',
    'aohrnialian@gmail.com'
];

function isEmailBanned(email) {
    if (!email) return false;

    // Los correos en la lista blanca nunca son baneados
    if (WHITELIST_EMAILS.includes(email.toLowerCase())) {
        return false;
    }

    const banData = localStorage.getItem(`ban_${email}`);
    if (!banData) return false;

    const lastSubmission = parseInt(banData, 10);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - lastSubmission < oneHour) {
        const remainingMinutes = Math.ceil((oneHour - (now - lastSubmission)) / (60 * 1000));
        return remainingMinutes;
    }

    // Si ya pasó más de una hora, limpiamos el registro
    localStorage.removeItem(`ban_${email}`);
    return false;
}

function banEmail(email) {
    if (!email) return;

    // No banear si está en la lista blanca
    if (WHITELIST_EMAILS.includes(email.toLowerCase())) {
        return;
    }

    localStorage.setItem(`ban_${email}`, Date.now().toString());
}

/**
 * Maneja la navegación entre secciones
 */
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));

    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Captura los datos del formulario (Lead Capture)
 */
function handleAuth(event) {
    event.preventDefault();

    const userData = {
        name: document.getElementById('user-name').value,
        role: document.getElementById('user-role').value,
        company: document.getElementById('user-company').value,
        fleetSize: document.getElementById('user-fleet-size').value,
        email: document.getElementById('user-email').value.trim().toLowerCase()
    };

    // Verificar si el email está en periodo de espera
    const waitingTime = isEmailBanned(userData.email);
    if (waitingTime) {
        alert(`Este correo electrónico ya ha completado una evaluación recientemente. Por seguridad y para garantizar la precisión de los resultados, debe esperar ${waitingTime} minutos antes de realizar una nueva radiografía.\n\nSi necesita asistencia inmediata, por favor contacte a LEX Recursos Humanos.`);
        return;
    }

    state.leads = userData;

    // Ofrecer ser recordado usando las herramientas del navegador (confirm)
    const shouldRemember = confirm(`${userData.name}, ¿deseas que te recordemos en este dispositivo para que la próxima vez entres directamente?`);

    if (shouldRemember) {
        localStorage.setItem('riesgo_user', JSON.stringify(userData));
    } else {
        localStorage.removeItem('riesgo_user');
    }

    console.log('Lead capturado:', state.leads);

    // Notificación visual breve
    if (shouldRemember) {
        console.log('Perfil guardado en este dispositivo.');
    }

    alert('¡Registro completado con éxito!');
    updateAuthUI(state.leads);

    showSection('quiz');

    if (state.answers.length > state.currentQuestionIndex) {
        if (state.currentQuestionIndex < QUESTIONS.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            showResults();
        }
    } else {
        renderQuestion();
    }

    // Asegurarse de que los botones de inicio ahora digan "Reiniciar radiografía"
    const headerBtn = document.getElementById('header-start-btn');
    if (headerBtn) headerBtn.innerText = 'Reiniciar radiografía';

    const heroBtn = document.getElementById('hero-start-btn');
    if (heroBtn) heroBtn.innerText = 'Reiniciar radiografía';
}

/**
 * Permite omitir el registro y continuar el quiz
 */
function skipAuth() {
    state.skippedAuth = true;
    showSection('quiz');

    if (state.answers.length > state.currentQuestionIndex) {
        if (state.currentQuestionIndex < QUESTIONS.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            showResults();
        }
    } else {
        renderQuestion();
    }

    // Asegurarse de que los botones de inicio ahora digan "Reiniciar radiografía"
    const headerBtn = document.getElementById('header-start-btn');
    if (headerBtn) headerBtn.innerText = 'Reiniciar radiografía';

    const heroBtn = document.getElementById('hero-start-btn');
    if (heroBtn) heroBtn.innerText = 'Reiniciar radiografía';
}

/**
 * Inicia el proceso del quiz
 */
function startQuiz() {
    // Verificar si el usuario ya está logueado y si tiene ban
    if (state.leads.email) {
        const waitingTime = isEmailBanned(state.leads.email);
        if (waitingTime) {
            alert(`Ya has completado una evaluación recientemente. Debes esperar ${waitingTime} minutos para realizar una nueva radiografía.\n\nTe recomendamos analizar los resultados obtenidos o contactarnos para una reunión personalizada.`);
            showSection('hero');
            return;
        }
    }

    state.currentQuestionIndex = 0;
    state.totalPoints = 0;
    state.answers = [];
    showSection('quiz');
    renderQuestion();

    // Cambiar los botones de inicio a "Reiniciar radiografía"
    const headerBtn = document.getElementById('header-start-btn');
    if (headerBtn) headerBtn.innerText = 'Reiniciar radiografía';

    const heroBtn = document.getElementById('hero-start-btn');
    if (heroBtn) heroBtn.innerText = 'Reiniciar radiografía';
}

/**
 * Renderiza la pregunta actual
 */
function renderQuestion() {
    const question = QUESTIONS[state.currentQuestionIndex];
    const totalQuestions = QUESTIONS.length - 1;

    let displayIndex;
    if (state.currentQuestionIndex <= 1) {
        displayIndex = state.currentQuestionIndex + 1;
    } else if (state.currentQuestionIndex === 2) {
        displayIndex = 2; // Parte de la 2
    } else {
        displayIndex = state.currentQuestionIndex;
    }

    // Actualizar progreso
    document.getElementById('question-count').innerText = `Pregunta ${displayIndex} de ${totalQuestions}`;

    // Actualizar categoría y texto
    document.getElementById('question-text').innerHTML = `
        <span class="category-label">
            ${question.category}
        </span>
        ${question.text}
    `;

    // Renderizar opciones
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    if (question.multiSelect) {
        // Renderizar checkboxes para selección múltiple
        optionsContainer.classList.remove('quiz-grid');
        optionsContainer.classList.add('quiz-checkbox-group');

        const optionsToRender = question.groupedOptions || question.options;

        optionsToRender.forEach((option, index) => {
            if (option.title) {
                // Título del grupo (no seleccionable)
                const titleElement = document.createElement('div');
                titleElement.className = 'quiz-group-title';
                titleElement.innerText = option.title;
                optionsContainer.appendChild(titleElement);

                // Opciones del grupo (seleccionables)
                option.items.forEach((item, itemIndex) => {
                    const label = document.createElement('label');
                    label.className = 'quiz-checkbox-item';
                    // El padding-left será el mismo que el base para alinear los checkboxes
                    label.innerHTML = `
                        <input type="checkbox" name="dg_option" value="${option.title}: ${item}">
                        <span class="quiz-checkbox-label" style="margin-left: 1.5rem;">${item}</span>
                    `;
                    optionsContainer.appendChild(label);
                });
            } else {
                // Opción simple
                const label = document.createElement('label');
                label.className = 'quiz-checkbox-item';
                label.innerHTML = `
                    <input type="checkbox" name="dg_option" value="${option.text}">
                    <span class="quiz-checkbox-label">${option.text}</span>
                `;
                optionsContainer.appendChild(label);
            }
        });

        // Botón para continuar
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary';
        nextBtn.style.width = 'fit-content';
        nextBtn.style.display = 'block';
        nextBtn.style.margin = '2rem auto 0';
        nextBtn.style.paddingInline = '3rem';
        nextBtn.innerText = 'Siguiente';
        nextBtn.onclick = () => {
            // Guardamos las respuestas múltiples
            const selected = Array.from(document.querySelectorAll('input[name="dg_option"]:checked')).map(cb => cb.value);
            handleAnswer(0, selected.join(', '));
        };
        optionsContainer.appendChild(nextBtn);
    } else {
        // Renderizar botones normales
        optionsContainer.classList.remove('quiz-checkbox-group');
        optionsContainer.classList.add('quiz-grid');

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.innerText = option.text;
            button.onclick = () => handleAnswer(option.points, index + 1);
            optionsContainer.appendChild(button);
        });
    }
}

/**
 * Procesa la respuesta seleccionada
 */
function handleAnswer(points, optionNumber) {
    state.totalPoints += points;
    state.answers.push({ points, optionNumber });

    // Lógica de salto condicional para Pregunta 2 (index 1)
    if (state.currentQuestionIndex === 1) {
        if (optionNumber === 3) {
            // Si es "Mercancías peligrosas", va a la nueva pregunta 3 (index 2)
            state.currentQuestionIndex = 2;
        } else {
            // Si es opción 1 o 2, salta a la pregunta 4 (que ahora es index 3)
            state.currentQuestionIndex = 3;
        }
        renderQuestion();
        return;
    }

    // El formulario de auth aparece después de un par de bloques
    // Ajustado para que aparezca después de la pregunta de Kilómetros (index 3)
    if (state.currentQuestionIndex === 3 && !state.leads.email && !state.skippedAuth) {
        showSection('auth');
        return;
    }

    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
        state.currentQuestionIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

/**
 * Muestra el resultado final
 */
function showResults() {
    const score = state.totalPoints;
    const percentile = ((score - 4) / (68 - 4)) * 100;

    const isDangerousGoods = state.answers[1]?.optionNumber === 3;
    // const dgTextGmail = isDangerousGoods ? 'El transporte de mercancías peligrosas implica riesgos específicos que pueden afectar la salud de las personas, el medio ambiente y los bienes materiales, así como también generar consecuencias directas sobre su propia operación. En este contexto, hemos desarrollado un programa de gestión de riesgos especialmente diseñado para este tipo de actividad, orientado a reducir de manera significativa la probabilidad de incidentes y sus posibles impactos.\n\n' : '';
    const dgTextHTML = isDangerousGoods ? 'El transporte de mercancías peligrosas implica riesgos específicos que pueden afectar la salud de las personas, el medio ambiente y los bienes materiales, así como también generar consecuencias directas sobre su propia operación. En este contexto, hemos desarrollado un programa de gestión de riesgos especialmente diseñado para este tipo de actividad, orientado a reducir de manera significativa la probabilidad de incidentes y sus posibles impactos.<br><br>' : '';
    let benchmarkText = '';

    if (percentile <= 20) benchmarkText = 'Operación con controles sólidos';
    else if (percentile <= 40) benchmarkText = 'Riesgo moderado';
    else if (percentile <= 60) benchmarkText = 'Nivel promedio del sector';
    else if (percentile <= 80) benchmarkText = 'Riesgo elevado';
    else if (percentile <= 95) benchmarkText = 'Riesgo crítico';
    else benchmarkText = 'Exposición extrema';

    let riskType = '';
    let screenText = '';
    let emailBody = '';
    let emailSubject = '';
    let accentColor = '';

    let gmailButtonBody = '';

    if (score <= 20) {
        riskType = 'RIESGO BAJO';
        accentColor = '#10b981'; // Verde
        screenText = 'La operación presenta buenas prácticas instaladas. Existen oportunidades de mejora preventiva para sostener los resultados en el tiempo.';
        emailSubject = 'Resultado de su Evaluación de Riesgo Operativo';

        // Contenido solo para Email Automático
        emailBody = `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">Hola${state.leads.name ? ', ' + state.leads.name : ''},<br><br>Gracias por completar la <strong>Radiografía Ejecutiva de Riesgo Operativo</strong>.<br><br>Según sus respuestas, su operación presenta un <strong style="color: #10b981;">NIVEL DE RIESGO BAJO</strong>.<br><br>Esto indica que existen buenas prácticas instaladas y un control operativo adecuado. Sin embargo, incluso en escenarios favorables, la experiencia demuestra que la prevención continua es clave para sostener estos resultados en el tiempo.<br><br>Quedo a disposición.<br><br><strong>Sergio De Rosa.</strong> Instructor en Seguridad Vial. Diplomado en el Transporte de Mercancías y Residuos Peligrosos por Carretera, IRAM-CATAMP. Perito Auxiliar en Seguridad Vial y Accidentología.<br><strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank">https://bio.site/LEXRRHH</a></div>`;

        // Contenido según imagen (Mantenido para el informe PDF)
        gmailButtonBody = `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">Estimado${state.leads.name ? ' ' + state.leads.name : ''},<br>Gracias por completar el diagnóstico de riesgo operativo.<br><br><strong style="font-size: 20px;">Nivel de Riesgo Detectado</strong><br>Resultado: <strong style="color: #10b981; font-size: 20px;">RIESGO BAJO</strong><br>Este nivel indica la presencia de buenas prácticas operativas y un adecuado control de la operación, reduciendo significativamente la probabilidad de siniestros.<br><br><strong>Score:</strong> ${score} puntos<br><strong>Nivel de riesgo:</strong> ${benchmarkText}<br><strong>Benchmark:</strong> Su empresa presenta un nivel de riesgo inferior al 90% de las flotas analizadas.<br><br>Esto indica que su operación se encuentra dentro de los niveles más bajos de riesgo del sector, con una base sólida de gestión operativa.<br><br>${dgTextHTML}<strong style="font-size: 18px;">Factores Críticos Detectados</strong><br>- Buenas prácticas operativas instaladas<br>- Conductores con experiencia<br>- Baja siniestralidad<br>- Control operativo adecuado<br><br><strong style="font-size: 18px;">Impacto Operativo</strong><br>- Riesgos residuales no detectados<br>- Dependencia de prácticas informales<br>- Vulnerabilidad ante cambios operativos<br><br><strong style="font-size: 18px;">Recomendaciones Iniciales</strong><br>- Formalizar sistema de gestión<br>- Estandarizar buenas prácticas<br>- Mantener capacitación continua<br>- Auditar periódicamente la operación<br><br><strong style="font-size: 18px;">Conclusión</strong><br>El nivel de riesgo detectado refleja una operación con buen nivel de control. El desafío principal es sostener y sistematizar estas prácticas en el tiempo.<br><br><strong>Sergio De Rosa.</strong> Instructor en Seguridad Vial. Diplomado en el Transporte de Mercancías y Residuos Peligrosos por Carretera, IRAM-CATAMP. Perito Auxiliar en Seguridad Vial y Accidentología.<br><strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank">https://bio.site/LEXRRHH</a><br><br><em>Este diagnóstico identifica riesgos, pero no los corrige. Para reducirlos de forma concreta, se recomienda una reunión de análisis personalizada.</em><br><br><small style="color: #666;">Documento confidencial - Uso exclusivo de la empresa</small></div>`;

    } else if (score <= 40) {
        riskType = 'RIESGO MEDIO';
        accentColor = '#f59e0b'; // Amarillo/Ambar
        screenText = 'Este nivel indica la presencia de prácticas y desvíos operativos que podrían derivar en siniestros evitables y sobrecostos si no se gestionan de forma preventiva.';
        emailSubject = 'Resultado de su Evaluación de Riesgo Operativo';

        // Contenido solo para Email Automático
        emailBody = `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">Hola${state.leads.name ? ', ' + state.leads.name : ''},<br><br>Gracias por completar la <strong>Radiografía Ejecutiva de Riesgo Operativo</strong>.<br><br>Según sus respuestas, su operación presenta un <strong style="color: #f59e0b;">NIVEL DE RIESGO MEDIO</strong>.<br><br>Este nivel indica la presencia de prácticas y desvíos operativos que podrían derivar en siniestros evitables y sobrecostos si no se gestionan de forma preventiva.<br><br>Quedo a disposición.<br><br><strong>Sergio De Rosa.</strong> Instructor en Seguridad Vial. Diplomado en el Transporte de Mercancías y Residuos Peligrosos por Carretera, IRAM-CATAMP. Perito Auxiliar en Seguridad Vial y Accidentología.<br><strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank">https://bio.site/LEXRRHH</a></div>`;

        // Contenido según información proporcionada (Mantenido para el informe PDF)
        gmailButtonBody = `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">Estimado${state.leads.name ? ' ' + state.leads.name : ''},<br>Gracias por completar el diagnóstico de riesgo operativo.<br><br><strong style="font-size: 20px;">Nivel de Riesgo Detectado</strong><br>Resultado: <strong style="color: #f59e0b; font-size: 20px;">RIESGO MEDIO</strong><br>Este nivel indica la presencia de prácticas y desvíos operativos que podrían derivar en siniestros evitables y sobrecostos si no se gestionan de forma preventiva.<br><br><strong>Score:</strong> ${score} puntos<br><strong>Nivel de riesgo:</strong> ${benchmarkText}<br><strong>Benchmark:</strong> Su empresa presenta un nivel de riesgo superior al 65% de las flotas analizadas.<br>Esto indica que su operación presenta un nivel de riesgo similar al de la mayoría de las flotas analizadas, pero con oportunidades claras de mejora para reducir exposición y costos.<br><br>${dgTextHTML}<strong style="font-size: 18px;">Factores Críticos Detectados</strong><br>- Inconsistencias en la gestión operativa<br>- Falta de seguimiento sistemático<br>- Capacitación no sostenida<br>- Hábitos de riesgo moderados<br><br><strong style="font-size: 18px;">Impacto Operativo</strong><br>- Incremento de siniestros evitables<br>- Aumento progresivo de costos<br>- Desviaciones normalizadas<br>- Exposición legal<br><br><strong style="font-size: 18px;">Recomendaciones Iniciales</strong><br>- Estandarizar procesos<br>- Implementar seguimiento<br>- Reforzar capacitación<br>- Corregir hábitos<br>- Incorporar indicadores<br><br><strong style="font-size: 18px;">Conclusión</strong><br>El nivel de riesgo detectado representa una oportunidad concreta de mejora. La implementación de un sistema de gestión preventiva permitirá reducir siniestralidad y optimizar costos.<br><br><strong>Sergio De Rosa.</strong> Instructor en Seguridad Vial. Diplomado en el Transporte de Mercancías y Residuos Peligrosos por Carretera, IRAM-CATAMP. Perito Auxiliar en Seguridad Vial y Accidentología.<br><strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank">https://bio.site/LEXRRHH</a><br><br><em>Este diagnóstico identifica riesgos, pero no los corrige. Para reducirlos de forma concreta, se recomienda una reunión de análisis personalizada.</em><br><br><small style="color: #666;">Documento confidencial – Uso exclusivo de la empresa</small></div>`;

    } else {
        riskType = 'RIESGO ALTO';
        accentColor = '#ef4444'; // Rojo
        screenText = 'Este nivel indica una exposición significativa en términos operativos, económicos y legales, con alta probabilidad de ocurrencia de siniestros.';
        emailSubject = 'Recomendación tras su Evaluación de Riesgo Operativo';

        // Contenido solo para Email Automático
        emailBody = `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">Hola${state.leads.name ? ', ' + state.leads.name : ''},<br><br>Gracias por completar la <strong>Radiografía Ejecutiva de Riesgo Operativo</strong>.<br><br>Según sus respuestas, su operación presenta un <strong style="color: #ef4444;">NIVEL DE RIESGO ALTO</strong>.<br><br>Este nivel indica una exposición significativa en términos operativos, económicos y legales, con alta probabilidad de ocurrencia de siniestros.<br><br>Quedo a disposición para una reunión de análisis prioritaria.<br><br><strong>Sergio De Rosa.</strong> Instructor en Seguridad Vial. Diplomado en el Transporte de Mercancías y Residuos Peligrosos por Carretera, IRAM-CATAMP. Perito Auxiliar en Seguridad Vial y Accidentología.<br><strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank">https://bio.site/LEXRRHH</a></div>`;

        // Contenido según información proporcionada (Mantenido para el informe PDF)
        gmailButtonBody = `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">Estimado${state.leads.name ? ' ' + state.leads.name : ''},<br>Gracias por completar el diagnóstico de riesgo operativo.<br><br><strong style="font-size: 20px;">Nivel de Riesgo Detectado</strong><br>Resultado: <strong style="color: #ef4444; font-size: 20px;">RIESGO ALTO</strong><br>Este nivel indica una exposición significativa en términos operativos, económicos y legales, con alta probabilidad de ocurrencia de siniestros.<br><br><strong>Score:</strong> ${score} puntos<br><strong>Nivel de riesgo:</strong> ${benchmarkText}<br><strong>Benchmark:</strong> Su empresa presenta un nivel de riesgo superior al 80% de las flotas analizadas.<br>Esto indica una posición crítica dentro del sector, con una exposición significativamente mayor al promedio.<br><br>${dgTextHTML}<strong style="font-size: 18px;">Factores Críticos Detectados</strong><br>- Exposición operativa crítica<br>- Conductores con baja experiencia o alta rotación<br>- Hábitos de riesgo frecuentes<br>- Ausencia de gestión preventiva<br><br><strong style="font-size: 18px;">Impacto Operativo</strong><br>- Alta probabilidad de siniestros<br>- Incremento de costos operativos<br>- Exposición legal significativa<br>- Pérdida de control operativo<br><br><strong style="font-size: 18px;">Recomendaciones Iniciales</strong><br>- Intervención inmediata en conductores<br>- Implementar sistema de gestión<br>- Definir protocolos obligatorios<br>- Medir costos y riesgos<br><br><strong style="font-size: 18px;">Conclusión</strong><br>El nivel de riesgo detectado requiere una intervención prioritaria. La implementación de un sistema estructurado de gestión es clave para recuperar el control operativo y reducir la exposición.<br><br><strong>Sergio De Rosa.</strong> Instructor en Seguridad Vial. Diplomado en el Transporte de Mercancías y Residuos Peligrosos por Carretera, IRAM-CATAMP. Perito Auxiliar en Seguridad Vial y Accidentología.<br><strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank">https://bio.site/LEXRRHH</a><br><br><em>Este diagnóstico identifica riesgos, pero no los corrige. Para reducirlos de forma concreta, se recomienda una reunión de análisis personalizada.</em><br><br><small style="color: #666;">Documento confidencial – Uso exclusivo de la empresa</small></div>`;
    }

    // Guardar los cuerpos por separado
    state.currentEmailSubject = emailSubject;
    state.currentEmailBody = emailBody; // Original
    // state.gmailButtonBody = gmailButtonBody; // Comentado (Gmail Manual)

    document.getElementById('risk-type').innerText = riskType;
    document.getElementById('risk-type').style.color = accentColor;
    document.getElementById('risk-description').innerHTML = `
        <p>${screenText}</p>
        <p class="result-note">
            Descargue el informe completo en PDF para ver el detalle de las recomendaciones.
        </p>
    `;

    // Preparar contenido para el PDF (oculto en pantalla)
    const pdfOutput = document.getElementById('pdf-content');
    if (pdfOutput) {
        // Usamos el mismo gmailButtonBody para el PDF ya que ahora tiene formato HTML
        pdfOutput.innerHTML = gmailButtonBody;

        // Cargar datos del lead en el encabezado del PDF
        document.getElementById('pdf-user-name').innerText = state.leads.name;
        document.getElementById('pdf-user-company').innerText = state.leads.company;
        document.getElementById('pdf-date').innerText = new Date().toLocaleDateString();
    }

    // Guardar automáticamente en Google Sheets
    const dataToSave = {
        name: state.leads.name,
        email: state.leads.email,
        company: state.leads.company,
        fleetSize: state.leads.fleetSize,
        role: state.leads.role,
        riskType: riskType,
        points: score,
        individualAnswers: state.answers.map(a => a.optionNumber) // Array con [1, 3, 2, ...]
    };
    saveToGoogleSheet(dataToSave);

    // Envío automático de email al terminar
    sendAutoEmail(riskType, emailSubject, emailBody);

    // Aplicar ban por 1 hora para evitar re-intentos constantes
    if (state.leads.email) {
        banEmail(state.leads.email);
    }

    showSection('result');
}

/**
 * Envía los datos a Google Sheets usando Apps Script
 */
async function saveToGoogleSheet(data) {
    if (!state.googleSheetUrl || state.googleSheetUrl.includes('XXXXXXXXXXXX')) {
        console.warn('Google Sheets URL no configurada correctamente.');
        return;
    }

    console.log('📤 Enviando datos a Google Sheets:', data);

    try {
        await fetch(state.googleSheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('✅ Datos enviados con éxito (revisa tu hoja de cálculo).');
    } catch (error) {
        console.error('❌ Error al enviar a Google Sheets:', error);
    }
}

/**
 * Envía los resultados por correo electrónico de forma automática usando EmailJS
 */
/**
 * [COMENTADO TEMPORALMENTE] Envía los resultados por correo electrónico de forma automática usando EmailJS
 * 
function sendEmail() {
    if (!state.leads.email) {
        alert("No se encontró un correo electrónico asociado.");
        return;
    }

    const btn = document.querySelector('.btn-secondary');
    const originalText = btn.innerText;

    // Estado de carga
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const riskType = document.getElementById('risk-type').innerText;
    const reportContent = state.gmailButtonBody || state.currentEmailBody || document.getElementById('pdf-content').innerText;
    const emailSubject = state.currentEmailSubject || `Resultados Radiografía de Riesgo - ${riskType}`;

    // Estos parámetros coinciden exactamente con tu nueva plantilla HTML
    const templateParams = {
        to_email: state.leads.email,
        name: 'LEX Recursos Humanos', // para {{name}}
        time: new Date().toLocaleString(), // para {{time}}
        message: reportContent, // para {{message}}
        subject: emailSubject
    };

    console.log('Iniciando envío de email a:', state.leads.email);
    console.log('Parámetros enviados:', templateParams);

    // CONFIGURACIÓN: Todos los casos usan la cuenta principal por ahora
    SERVICE_ID = 'service_x0bzq7l';
    TEMPLATE_ID = 'template_dzf9trj';
    PUBLIC_KEY = 'LVsT7wnz6G3_xp-AL';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then(() => {
            console.log('Email enviado con éxito a:', state.leads.email);
            btn.innerText = "¡Enviado con éxito!";
            btn.style.background = "#10b981"; // Verde éxito
            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = originalText;
                btn.style.background = ""; // Reset
            }, 3000);
        })
        .catch((error) => {
            console.error('Error detallado de EmailJS:', error);
            let errorMessage = "Hubo un problema al enviar el correo.";

            if (error.status === 401 || error.status === 403) {
                errorMessage = "Error de autenticación con EmailJS. Por favor revise las credenciales.";
            } else if (error.text) {
                errorMessage = "Error: " + error.text;
            }

            alert(errorMessage);
            btn.disabled = false;
            btn.innerText = originalText;
        });
}
*/

/**
 * Envío automático y silencioso al finalizar el test
 */
function sendAutoEmail(riskType, emailSubject, emailBody) {
    if (!state.leads.email) {
        console.log('No se envía email automático: el usuario no proporcionó correo.');
        return;
    }

    const templateParams = {
        to_email: state.leads.email,
        name: 'LEX Recursos Humanos',
        time: new Date().toLocaleString(),
        message: emailBody,
        subject: emailSubject
    };

    console.log('📤 Iniciando envío automático de email a:', state.leads.email);

    // CONFIGURACIÓN: Todos los casos usan la cuenta principal por ahora
    let SERVICE_ID = 'service_x0bzq7l';
    let TEMPLATE_ID = 'template_dzf9trj';
    let PUBLIC_KEY = 'LVsT7wnz6G3_xp-AL';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then(() => {
            console.log('✅ Email automático enviado con éxito.');
        })
        .catch((error) => {
            console.error('❌ Error en el envío automático de EmailJS:', error);
        });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Se comenta inicialización global para permitir usar distintas cuentas de EmailJS
    // emailjs.init("QqvN175XJ37_kz0JR");
    checkSavedUser();
});

/**
 * Actualiza la interfaz para mostrar el usuario activo
 */
function updateAuthUI(userData) {
    if (!userData || !userData.name) return;

    // Ocultar botón de registrarse en la barra de navegación si está registrado
    const navRegisterBtn = document.getElementById('nav-register-btn');
    if (navRegisterBtn) {
        navRegisterBtn.style.display = 'none';
    }

    // Actualizar botones de "Comenzar"
    const buttonsToUpdate = [document.getElementById('header-start-btn'), document.getElementById('hero-start-btn')];
    buttonsToUpdate.forEach(btn => {
        if (!btn) return;
        const currentText = btn.innerText;
        // Buscamos botones que parezcan de inicio (Comenzar, Iniciar, etc.)
        if (currentText.toLowerCase().includes('comenzar') || currentText.toLowerCase().includes('iniciar')) {
            const firstName = userData.name.split(' ')[0];
            btn.innerText = `Continuar como ${firstName}`;

            // Asegurarnos de que el botón vaya al quiz
            btn.onclick = (e) => {
                e.preventDefault();
                startQuiz();
            };

            // Añadir link de "No soy yo" (evitar duplicados)
            const logoutId = 'logout-link-' + btn.id;
            if (!document.getElementById(logoutId)) {
                const logoutLink = document.createElement('a');
                logoutLink.id = logoutId;
                logoutLink.href = '#';
                logoutLink.innerText = 'Cambiar usuario';
                logoutLink.className = 'logout-link';
                logoutLink.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
                btn.after(logoutLink);
            }
        }
    });
}

/**
 * Revisa si hay un usuario guardado en localStorage y salta el registro si existe
 */
function checkSavedUser() {
    const savedUser = localStorage.getItem('riesgo_user');
    if (savedUser) {
        try {
            const userData = JSON.parse(savedUser);
            state.leads = userData;
            console.log('Usuario recordado:', state.leads);
            updateAuthUI(userData);
        } catch (e) {
            console.error('Error al cargar usuario guardado', e);
            localStorage.removeItem('riesgo_user');
        }
    }
}

/**
 * Limpia los datos guardados y reinicia la vista
 */
function logout() {
    localStorage.removeItem('riesgo_user');
    state.leads = { name: '', role: '', company: '', fleetSize: '', email: '' };

    // Recargar para limpiar todo el estado limpiamente
    window.location.reload();
}
