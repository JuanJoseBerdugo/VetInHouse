import { db } from "./firebase-config.js";
import { doc, setDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Variables globales
let currentPaymentMethod = 'credit-card';
let transactionId = generateTransactionId();
let transactionDate = new Date();

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar loader después de cargar
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2000);
    
    // Inicializar navegación
    initNavigation();
    
    // Inicializar tabs de métodos de pago
    initPaymentTabs();
    
    // Inicializar simulación de tarjeta de crédito
    initCreditCardSimulation();
    
    // Inicializar eventos de botones
    initButtonEvents();
    
    // Actualizar fecha en la factura
    updateInvoiceDate();
});

// Generar ID de transacción
function generateTransactionId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `TRX-${year}${month}${day}-${random}`;
}

// Formatear fecha
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Actualizar fecha en la factura
function updateInvoiceDate() {
    const invoiceDate = document.getElementById('invoiceDate');
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    invoiceDate.textContent = `Fecha: ${day}/${month}/${year}`;
}

// Inicializar navegación
function initNavigation() {
    const view1 = document.getElementById('view1');
    const view2 = document.getElementById('view2');
    const view3 = document.getElementById('view3');
    
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    const toPaymentBtn = document.getElementById('toPaymentBtn');
    const backToSummaryBtn = document.getElementById('backToSummaryBtn');
    const processPaymentBtn = document.getElementById('processPaymentBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    
    // Ir a la vista de pago
    toPaymentBtn.addEventListener('click', () => {
        view1.classList.remove('active');
        view2.classList.add('active');
        step1.classList.remove('active');
        step2.classList.add('active');
    });
    
    // Volver a la vista de resumen
    backToSummaryBtn.addEventListener('click', () => {
        view2.classList.remove('active');
        view1.classList.add('active');
        step2.classList.remove('active');
        step1.classList.add('active');
    });
    
    // Procesar pago
    processPaymentBtn.addEventListener('click', () => {
        // Validar formulario según el método de pago seleccionado
        if (!validatePaymentForm()) {
            return;
        }
        
        // Mostrar modal de procesamiento
        showProcessingModal();
    });
    
    // Volver al inicio
    backToHomeBtn.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
}

// Inicializar tabs de métodos de pago
function initPaymentTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Actualizar tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Actualizar contenidos
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            // Actualizar método de pago actual
            currentPaymentMethod = tabId;
        });
    });
}

// Inicializar simulación de tarjeta de crédito
function initCreditCardSimulation() {
    const cardWrapper = document.getElementById('cardWrapper');
    const cardNumber = document.getElementById('cardNumber');
    const cardHolder = document.getElementById('cardHolder');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    const cardType = document.getElementById('cardType');
    
    const cardNumberDisplay = document.getElementById('cardNumberDisplay');
    const cardHolderDisplay = document.getElementById('cardHolderDisplay');
    const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
    const cvvDisplay = document.getElementById('cvvDisplay');
    const cardBrand = document.getElementById('cardBrand');
    
    // Formatear número de tarjeta
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        
        // Actualizar visualización
        cardNumberDisplay.textContent = formattedValue || '•••• •••• •••• ••••';
    });
    
    // Actualizar nombre del titular
    cardHolder.addEventListener('input', function(e) {
        cardHolderDisplay.textContent = e.target.value.toUpperCase() || 'NOMBRE DEL TITULAR';
    });
    
    // Formatear fecha de expiración
    cardExpiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
        cardExpiryDisplay.textContent = value || 'MM/AA';
    });
    
    // Actualizar CVV
    cardCvv.addEventListener('focus', function() {
        cardWrapper.classList.add('flipped');
    });
    
    cardCvv.addEventListener('blur', function() {
        cardWrapper.classList.remove('flipped');
    });
    
    cardCvv.addEventListener('input', function(e) {
        cvvDisplay.textContent = e.target.value || '•••';
    });
    
    // Actualizar tipo de tarjeta
    cardType.addEventListener('change', function(e) {
        cardBrand.textContent = e.target.options[e.target.selectedIndex].text.toUpperCase();
    });
}

// Inicializar eventos de botones
function initButtonEvents() {
    const downloadInvoiceBtn = document.getElementById('downloadInvoiceBtn');
    const closeInvoiceModal = document.getElementById('closeInvoiceModal');
    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    // Mostrar modal de factura
    downloadInvoiceBtn.addEventListener('click', () => {
        showInvoiceModal();
    });
    
    // Cerrar modal de factura
    closeInvoiceModal.addEventListener('click', () => {
        document.getElementById('invoiceModal').classList.remove('show');
    });
    
    // Imprimir factura
    printInvoiceBtn.addEventListener('click', () => {
        printInvoice();
    });
    
    // Descargar factura como PDF (simulado)
    downloadPdfBtn.addEventListener('click', () => {
        alert('La factura se está descargando como PDF...');
        // En un caso real, aquí se implementaría la generación del PDF
    });
}

// Validar formulario de pago
function validatePaymentForm() {
    let isValid = true;
    let errorMessage = '';
    
    switch (currentPaymentMethod) {
        case 'credit-card':
            const cardNumber = document.getElementById('cardNumber').value;
            const cardHolder = document.getElementById('cardHolder').value;
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCvv = document.getElementById('cardCvv').value;
            
            if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
                errorMessage = 'Por favor, ingresa un número de tarjeta válido.';
                isValid = false;
            } else if (!cardHolder) {
                errorMessage = 'Por favor, ingresa el nombre del titular de la tarjeta.';
                isValid = false;
            } else if (!cardExpiry || cardExpiry.length < 5) {
                errorMessage = 'Por favor, ingresa una fecha de expiración válida (MM/AA).';
                isValid = false;
            } else if (!cardCvv || cardCvv.length < 3) {
                errorMessage = 'Por favor, ingresa un código de seguridad válido.';
                isValid = false;
            }
            break;
            
        case 'pse':
            const pseBank = document.getElementById('pseBank').value;
            const pseDocNumber = document.getElementById('pseDocNumber').value;
            
            if (!pseBank || pseBank === '') {
                errorMessage = 'Por favor, selecciona un banco.';
                isValid = false;
            } else if (!pseDocNumber) {
                errorMessage = 'Por favor, ingresa tu número de documento.';
                isValid = false;
            }
            break;
            
        case 'nequi':
            const nequiPhone = document.getElementById('nequiPhone').value;
            
            if (!nequiPhone || nequiPhone.length < 10) {
                errorMessage = 'Por favor, ingresa un número de celular válido.';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        alert(errorMessage);
    }
    
    return isValid;
}

// Mostrar modal de procesamiento
function showProcessingModal() {
    const processingModal = document.getElementById('processingModal');
    const processingMessage = document.getElementById('processingMessage');
    const processingProgressBar = document.getElementById('processingProgressBar');
    
    // Mostrar modal
    processingModal.classList.add('show');
    
    // Simular progreso
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        processingProgressBar.style.width = `${progress}%`;
        
        if (progress === 30) {
            processingMessage.textContent = 'Verificando información...';
        } else if (progress === 60) {
            processingMessage.textContent = 'Procesando pago...';
        } else if (progress === 90) {
            processingMessage.textContent = 'Confirmando transacción...';
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Guardar datos en Firebase
            savePaymentToFirebase()
                .then(() => {
                    setTimeout(() => {
                        processingModal.classList.remove('show');
                        showConfirmationView();
                    }, 500);
                })
                .catch(error => {
                    console.error("Error al guardar el pago:", error);
                    alert("Ocurrió un error al procesar el pago. Por favor, intenta de nuevo.");
                    processingModal.classList.remove('show');
                });
        }
    }, 100);
}

// Guardar datos del pago en Firebase
async function savePaymentToFirebase() {
    // Obtener datos del cliente
    const nombre = document.getElementById('nombre').value;
    const documento = document.getElementById('documento').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    
    // Obtener detalles del método de pago
    let paymentDetails = {};
    
    switch (currentPaymentMethod) {
        case 'credit-card':
            const cardNumber = document.getElementById('cardNumber').value;
            const cardType = document.getElementById('cardType').value;
            const cardInstallments = document.getElementById('cardInstallments').value;
            
            paymentDetails = {
                tipo: 'Tarjeta de crédito',
                numeroTarjeta: cardNumber.slice(-4).padStart(cardNumber.length, '•'),
                tipoTarjeta: cardType,
                cuotas: cardInstallments
            };
            break;
            
        case 'pse':
            const pseBank = document.getElementById('pseBank').value;
            const pseDocType = document.getElementById('pseDocType').value;
            const pseAccountType = document.getElementById('pseAccountType').value;
            
            paymentDetails = {
                tipo: 'PSE',
                banco: pseBank,
                tipoDocumento: pseDocType,
                tipoCuenta: pseAccountType
            };
            break;
            
        case 'nequi':
            const nequiPhone = document.getElementById('nequiPhone').value;
            
            paymentDetails = {
                tipo: 'Nequi',
                telefono: nequiPhone.slice(-4).padStart(nequiPhone.length, '•')
            };
            break;
    }
    
    // Crear objeto de pago
    const paymentData = {
        transaccionId: transactionId,
        fecha: serverTimestamp(),
        estado: 'Aprobado',
        monto: 178500,
        cliente: {
            nombre,
            documento,
            email,
            telefono,
            direccion
        },
        metodoPago: paymentDetails,
        items: [
            {
                descripcion: 'Consulta Veterinaria',
                cantidad: 1,
                precioUnitario: 80000,
                iva: 15200,
                total: 95200
            },
            {
                descripcion: 'Medicamentos',
                cantidad: 1,
                precioUnitario: 45000,
                iva: 8550,
                total: 53550
            },
            {
                descripcion: 'Servicio a domicilio',
                cantidad: 1,
                precioUnitario: 25000,
                iva: 4750,
                total: 29750
            }
        ],
        subtotal: 150000,
        iva: 28500,
        total: 178500
    };
    
    // Guardar en Firestore
    try {
        const pagoRef = doc(collection(db, "pagos"));
        await setDoc(pagoRef, paymentData);
        return true;
    } catch (error) {
        console.error("Error al guardar el pago:", error);
        throw error;
    }
}

// Mostrar vista de confirmación
function showConfirmationView() {
    const view2 = document.getElementById('view2');
    const view3 = document.getElementById('view3');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    // Actualizar vistas
    view2.classList.remove('active');
    view3.classList.add('active');
    step2.classList.remove('active');
    step3.classList.add('active');
    
    // Actualizar detalles de la transacción
    document.getElementById('transactionId').textContent = transactionId;
    document.getElementById('transactionDate').textContent = formatDate(transactionDate);
    
    // Actualizar método de pago mostrado
    let paymentMethodText = '';
    
    switch (currentPaymentMethod) {
        case 'credit-card':
            const cardNumber = document.getElementById('cardNumber').value;
            paymentMethodText = `Tarjeta de crédito terminada en ${cardNumber.slice(-4)}`;
            break;
            
        case 'pse':
            const pseBank = document.getElementById('pseBank').value;
            const bankName = document.querySelector(`#pseBank option[value="${pseBank}"]`).textContent;
            paymentMethodText = `PSE - ${bankName}`;
            break;
            
        case 'nequi':
            const nequiPhone = document.getElementById('nequiPhone').value;
            paymentMethodText = `Nequi - Número terminado en ${nequiPhone.slice(-4)}`;
            break;
    }
    
    document.getElementById('paymentMethod').textContent = paymentMethodText;
}

// Mostrar modal de factura
function showInvoiceModal() {
    const invoiceModal = document.getElementById('invoiceModal');
    
    // Actualizar datos del cliente en la factura
    document.getElementById('invoiceCustomerName').textContent = document.getElementById('nombre').value;
    document.getElementById('invoiceCustomerId').textContent = document.getElementById('documento').value;
    document.getElementById('invoiceCustomerAddress').textContent = document.getElementById('direccion').value;
    document.getElementById('invoiceCustomerPhone').textContent = document.getElementById('telefono').value;
    document.getElementById('invoiceCustomerEmail').textContent = document.getElementById('email').value;
    
    // Actualizar método de pago en la factura
    document.getElementById('invoicePaymentMethod').textContent = document.getElementById('paymentMethod').textContent;
    document.getElementById('invoiceTransactionId').textContent = transactionId;
    
    // Mostrar modal
    invoiceModal.classList.add('show');
}

// Imprimir factura
function printInvoice() {
    const invoiceContainer = document.getElementById('invoiceContainer').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px;">
            ${invoiceContainer}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    
    // Reinicializar eventos después de restaurar el contenido
    initNavigation();
    initPaymentTabs();
    initCreditCardSimulation();
    initButtonEvents();
}