@startuml EcommerceMotosYamaha

title Diagrama de Clases - E-commerce Motos Yamaha Colombia

class Cliente {
  - id: int
  - nombre: string
  - email: string
  - telefono: string
  - numeroDocumento: string
  - ciudad: string
  - direccion: string
  - departamento: string
  + registrar(): void
  + iniciarSesion(): boolean
  + realizarPedido(): Pedido
  + agendarCita(): Cita
}

class Moto {
  - id: int
  - modelo: string
  - año: int
  - cilindrada: int
  - precio: decimal
  - color: string
  - stock: int
  - categoria: string
  + consultarDisponibilidad(): boolean
  + actualizarStock(cantidad: int): void
}

class Pedido {
  - id: int
  - numeroPedido: string
  - fecha: Date
  - estado: string
  - cantidad: int
  - precioUnitario: decimal
  - subtotal: decimal
  - iva: decimal
  - total: decimal
  + calcularTotal(): decimal
  + actualizarEstado(nuevoEstado: string): void
  + generarFactura(): void
}

class Pago {
  - id: int
  - monto: decimal
  - fecha: Date
  - metodoPago: string
  - estado: string
  - referencia: string
  + procesarPago(): boolean
  + generarComprobante(): void
}

class Envio {
  - id: int
  - fechaEnvio: Date
  - fechaEntrega: Date
  - numeroGuia: string
  - estado: string
  - costoEnvio: decimal
  + rastrearEnvio(): string
  + calcularCosto(): decimal
}

class Cita {
  - id: int
  - fecha: Date
  - hora: string
  - estado: string
  - canalContacto: string
  - mensaje: string
  + agendarCita(): boolean
  + cancelarCita(): void
  + confirmarCita(): void
  + enviarRecordatorio(): void
}

' ============= RELACIONES =============

Cliente "1" -- "0..*" Pedido : realiza >
Cliente "1" -- "0..*" Cita : agenda >
Pedido "0..*" -- "1" Moto : incluye >
Pedido "1" -- "1" Pago : tiene >
Pedido "1" -- "0..1" Envio : genera >
Cita "0..*" -- "1" Moto : refiere >

' ============= NOTAS =============

note right of Moto
  Catálogo Yamaha Colombia
  Precio en COP
end note

note right of Pago
  Métodos: Tarjeta, PSE,
  Transferencia, Crédito
end note

note right of Cita
  Reserva de cita para ver
  la moto en persona.
  Contacto vía WhatsApp.
end note

note bottom of Pedido
  Pedido directo online.
  Incluye datos de cantidad
  y precio de la moto.
end note

@enduml