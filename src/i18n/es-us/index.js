// This is just an example,
// so you can safely delete all default props below

export default {
  template: {
    personal: 'personal',
    management: 'administración',
    actions: 'acciones',
    search: 'buscar'
  },

  // users
  user: {
    add: 'agregar usuario',
    sender_type: 'tipo de remitente',
    name: 'nombre o razón social',
    last_name: 'apellido',
    document_number: 'número de identificación',
    document_type: 'tipo de documento',
    phone: 'número de teléfono',
    email: 'correo',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    saveSuccess: 'usuario agregado exitosamente',
    password: 'clave',
    list: 'lista de usuarios',
    roles: 'roles',
    branch_offices: 'sucursales',
    update: 'Editar usuario'
  },
  role: {
    acronym: 'acronimo',
    name: 'nombre',
    list: 'roles',
    permissionChangeSuccefull: 'rol modificado exitosamente',
    permissionChangeError: 'ha ocurrido un error'
  },
  // modules
  modules: {
    egress: 'egreso',
    'new-entry': 'nuevo ingreso',
    'new-egress': 'nuevo egreso',
    partner: 'socios',
    entries: 'Lista de ingreso',
    egresses: 'lista de egresos',
    workers: 'trabajadores',
    users: 'usuarios',
    concepts: 'conceptos'
  },
  partner: {
    add: 'agregar socio',
    name: 'nombre',
    last_name: 'apellido',
    email: 'correo',
    phone: 'telefono',
    document_number: 'número de documento',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    list: 'Lista de socios',
    update: 'modificar'
  },
  worker: {
    add: 'agregar trabajdor',
    name: 'nombre',
    last_name: 'apellido',
    email: 'correo',
    phone: 'telefono',
    document_number: 'número de documento',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    list: 'Lista de trabajdores',
    update: 'modificar'
  },
  // roles
  roles: {
    acronym: 'acrónimo',
    name: 'nombre',
    listRoles: 'lista de roles',
    description: 'descripción',
    add: 'agregar',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar'
  },
  egress: {
    newEgress: 'nuevo egreso',
    add: 'agregar egreso',
    worker: 'trabajador',
    created_at: 'fecha',
    concept: 'concepto',
    list: 'Lista de egresos',
    amount: 'monto',
    saveSuccess: 'Recibo creado exitosamente',
    download: 'descargas',
    PDF: 'PDF'
  },
  concept: {
    newConcept: 'nuevo concepto',
    add: 'agregar concepto',
    created_at: 'fecha',
    concept: 'concepto',
    list: 'Lista de conceptos',
    price: 'precio',
    saveSuccess: 'Concepto creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    download: 'descargas',
    PDF: 'PDF',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre'
  },
  entry: {
    saveErrorPayment: 'Ingrese los campos requeridos',
    created_at: 'fecha',
    list: 'lista de ingresos',
    total: 'total',
    cash: 'efectivo',
    add: 'agregar ingreso',
    saveBilling: 'guardar factura',
    saveSuccess: 'Recibo creado exitosamente',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    download: 'descargas',
    PDF: 'PDF',
    options: 'opciones',
    partner: 'Socio',
    concepts: 'conceptos',
    newEntry: 'Nuevo ingreso'
  }
}
