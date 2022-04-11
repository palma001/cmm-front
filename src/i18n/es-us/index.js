// This is just an example,
// so you can safely delete all default props below

export default {
  template: {
    personal: 'personal',
    management: 'administración',
    actions: 'acciones',
    search: 'buscar',
    noResults: 'sin datos',
    settings: 'Configuración',
    organization: 'organización'
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
  beneficiary: {
    add: 'agregar beneficiario',
    name: 'nombre o razón social',
    last_name: 'apellido',
    document_number: 'número de identificación',
    phone_number: 'número de teléfono',
    email: 'correo',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    saveSuccess: 'beneficiario agregado exitosamente',
    list: 'lista de beneficiarios',
    update: 'Editar beneficiario'
  },
  role: {
    acronym: 'acronimo',
    name: 'nombre',
    list: 'roles',
    permissionChangeSuccefull: 'rol modificado exitosamente',
    permissionChangeError: 'ha ocurrido un error'
  },
  boxClosure: {
    from_date: 'Desde',
    to_date: 'Hasta',
    list: 'Lista de cierres',
    add: 'Agregar cierre',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    update: 'Modificar',
    user: 'responsable'
  },
  // modules
  modules: {
    coin: 'Moneda',
    orders: 'transacciones',
    entities: 'entidades',
    fields: 'campos',
    organizations: 'organizaciones',
    beneficiaries: 'beneficiarios',
    responsables: 'responsables',
    'operation-types': 'tipos de operaciones',
    'egress-types': 'tipos de egreso',
    'new-order': 'Nueva transacción'
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
    PDF: 'PDF',
    business_name: 'rasón social',
    serie_number: 'Número de recibo',
    document_number: 'Documento'
  },
  coin: {
    newCoin: 'nuevo moneda',
    add: 'agregar moneda',
    created_at: 'fecha',
    concept: 'moneda',
    list: 'Lista de monedas',
    symbol: 'Simbolo',
    saveSuccess: 'Moneda creado exitosamente',
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
  egressType: {
    newEgressType: 'nuevo tipo de egreso',
    add: 'agregar tipo de egreso',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Lista de tipo de egresos',
    description: 'descripción',
    saveSuccess: 'tipo de egreso creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre'
  },
  operationType: {
    newOperationType: 'nuevo tipo de operacion',
    add: 'agregar tipo de operacion',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'tipo de operacioness',
    description: 'descripción',
    saveSuccess: 'tipo de operacion creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre'
  }
}
