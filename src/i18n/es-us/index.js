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
    update: 'Editar usuario',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
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
    addSuccessful: 'beneficiario agregado exitosamente',
    list: 'lista de beneficiarios',
    update: 'Editar beneficiario',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  materialSupplier: {
    img: 'Imagen',
    add: 'agregar proveedor de material',
    name: 'nombre o razón social',
    address: 'dirección',
    document_number: 'número de identificación',
    phone_number: 'número de teléfono',
    email: 'correo',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'proveedor de material agregado exitosamente',
    list: 'proveedores de materiales',
    update: 'Editar proveedor de material',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  client: {
    img: 'Imagen',
    add: 'agregar cliente',
    name: 'nombre o razón social',
    address: 'dirección',
    document_number: 'número de identificación',
    phone_number: 'número de teléfono',
    email: 'correo',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'cliente agregado exitosamente',
    list: 'clientes',
    update: 'Editar cliente',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  fieldSupervisor: {
    add: 'agregar supervisor',
    name: 'nombre o razón social',
    last_name: 'apellido',
    document_number: 'número de identificación',
    phone_number: 'número de teléfono',
    email: 'correo',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'supervisor agregado exitosamente',
    list: 'lista de supervisores',
    update: 'Editar supervisor',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  responsable: {
    add: 'agregar responsable',
    name: 'nombre o razón social',
    last_name: 'apellido',
    document_number: 'número de identificación',
    phone_number: 'número de teléfono',
    email: 'correo',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'responsable agregado exitosamente',
    list: 'lista de responsables',
    update: 'Editar responsable',
    beneficiary_id: 'beneficiario',
    beneficiary: 'beneficiario',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
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
    coin: 'Monedas',
    orders: 'transacciones',
    roles: 'roles',
    entities: 'entidades',
    'delivery-notes': 'notas de entrega',
    fields: 'campos',
    organizations: 'organizaciones',
    beneficiaries: 'beneficiarios',
    responsables: 'responsables',
    clients: 'clientes',
    states: 'estados',
    'material-suppliers': 'proveedores de material',
    concepts: 'Conceptos',
    'field-supervisor': 'supervisores de campo',
    'concept-types': 'tipo de conceptos',
    'operation-types': 'tipo de operaciones',
    'egress-types': 'tipo de egresos',
    'new-order': 'Nueva transacción'
  },
  order: {
    newOrder: 'Nueva Transacción'
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
  conceptType: {
    newConceptType: 'nuevo tipo de concepto',
    add: 'agregar tipo de concepto',
    sign: 'signo',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Lista de tipo de conceptos',
    description: 'descripción',
    saveSuccess: 'tipo de concepto creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre'
  },
  concept: {
    newConcept: 'nuevo concepto',
    add: 'agregar concepto',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Lista de conceptos',
    description: 'descripción',
    saveSuccess: 'concepto creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre',
    concept_type: 'Tipo de concepto'
  },
  organization: {
    newOrganization: 'nuevo organización',
    add: 'agregar organización',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Lista de organizaciones',
    description: 'descripción',
    saveSuccess: 'organización creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre'
  },
  state: {
    newOrganization: 'nuevo estado',
    add: 'agregar estado',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Estados',
    saveSuccess: 'estado creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre'
  },
  entity: {
    newOrganization: 'nuevo entidad',
    add: 'agregar entidad',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Lista de entidades',
    description: 'descripción',
    saveSuccess: 'entidad creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre'
  },
  field: {
    newOrganization: 'nuevo campo',
    address: 'dirección',
    acronym: 'acronimo',
    denomination: 'denominación',
    field_supervisor: 'supervisor de campo',
    organization: 'Organización',
    add: 'agregar campo',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Lista de campos',
    description: 'descripción',
    saveSuccess: 'campo creado exitosamente',
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
