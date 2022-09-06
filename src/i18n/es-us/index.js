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
    withoutConnection: 'Sin conexión a internet',
    connection: 'Conexión restaurada',
    organization: 'organización'
  },

  // users
  user: {
    role: 'roles',
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
  driver: {
    'App\\Models\\Provider': 'Proveedor',
    'App\\Models\\Organization': 'Organización',
    add: 'agregar conductor',
    name: 'nombre o razón social',
    last_name: 'apellido',
    document_number: 'número de identificación',
    phone_number: 'número de teléfono',
    email: 'correo',
    ownerable: 'propietario',
    ownerable_id: 'propietario',
    ownerable_type: 'tipo de propietario',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'conductor agregado exitosamente',
    list: 'lista de conductores',
    update: 'Editar conductor',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  active: {
    'App\\Models\\Provider': 'Proveedor',
    'App\\Models\\Organization': 'Organización',
    add: 'agregar activo',
    active: 'Activo',
    inactive: 'Inactivo',
    name: 'nombre',
    description: 'descripción',
    brand: 'marca',
    plate: 'placa',
    status: 'estado',
    model: 'modelo',
    email: 'correo',
    ownerable: 'propietario',
    ownerable_id: 'propietario',
    ownerable_type: 'tipo de propietario',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'activo agregado exitosamente',
    list: 'activos',
    update: 'Editar activo',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  trailer: {
    'App\\Models\\Provider': 'Proveedor',
    'App\\Models\\Organization': 'Organización',
    add: 'agregar tráiler',
    active: 'Activo',
    inactive: 'Inactivo',
    plate: 'placa',
    status: 'estado',
    model: 'modelo',
    brand: 'marca',
    color: 'color',
    ownerable: 'propietario',
    ownerable_id: 'propietario',
    ownerable_type: 'tipo de propietario',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'tráiler agregado exitosamente',
    list: 'lista de tráilers',
    update: 'Editar tráiler',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  provider: {
    serie_number: 'correlativo',
    seal: 'sello',
    signature: 'firma',
    logo: 'logo',
    add: 'agregar proveedor',
    name: 'nombre o razón social',
    address: 'dirección',
    document_number: 'número de identificación',
    phone_number: 'número de teléfono',
    email: 'correo',
    reset: 'Limpiar',
    cancel: 'Cancelar',
    addSuccessful: 'proveedor agregado exitosamente',
    list: 'proveedores',
    update: 'Editar proveedor',
    deleteSuccessful: 'eliminado exitasamente',
    editSuccessful: 'modificado exitosamente'
  },
  client: {
    img: 'Imagen',
    states: 'estados',
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
    name: 'nombre',
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
  deliveryNote: {
    serie_number: 'Correlativo',
    guide_number: 'Numero de guia',
    material_supplier: 'Proveedor de material',
    start_date: 'Fecha de inicio',
    deadline: 'Fecha de cierre',
    client: 'cliente',
    driver_name: 'chofer',
    material: 'material',
    created_at: 'fecha de registro',
    origin_address: 'dirección de origen',
    destination_address: 'dirección del destino',
    vehicle_plate: 'placa del vehículo',
    vehicle_brand: 'marca del vehículo',
    vehicle_model: 'modelo del vehículo',
    trailer_model: 'modelo del trailer',
    trailer_plate: 'placa del trailer',
    list: 'Notas de entrega de material',
    update: 'Modificar',
    reset: 'limpiar',
    cancel: 'cancelar'
  },
  providerRate: {
    description: 'descripción',
    rate: 'Tarifa',
    coin: 'Moneda',
    provider: 'proveedor',
    deleteSuccessful: 'Eliminado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    unit_of_measurement: 'unidad de medida',
    list: 'Lista de tarifas',
    update: 'Modificar',
    reset: 'limpiar',
    add: 'agregar tarifa',
    cancel: 'cancelar'
  },
  // modules
  modules: {
    'payment-orders': 'Ordenes de pago',
    banks: 'bancos',
    guides: 'Guías',
    transactions: 'Transacciones',
    tickets: 'Tickets',
    'field-cash-flows': 'Flujo de caja',
    rates: 'Tarifa de proveedores',
    'provider-types': 'tipos de proveedores',
    actives: 'activos',
    trailers: 'Tráiler',
    drivers: 'conductores',
    'vehicle-types': 'Tipos de vehículo',
    users: 'Usuarios',
    coins: 'Monedas',
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
    concepts: 'Conceptos',
    providers: 'proveedores',
    'field-supervisors': 'supervisores de campo',
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
  fieldCashFlow: {
    addSuccessful: '¡Flujo cargado exitosamente!',
    approvedSuccess: '¡Aprobado exitosamente!',
    errorAmountImage: 'Las imagenes son requeridas, minimo de imagen: 3',
    pending_approval: 'Por aprobar',
    approved: 'Aprobado',
    canceled: 'Cancelado'
  },
  paymentOrder: {
    addSuccessful: '¡Orden de pago agregada exitosamente!',
    editSuccessful: '¡Orden de pago editada exitosamente!',
    deleteSuccessful: '¡Orden de pago eliminada exitosamente!',
    amount: 'Monto',
    description: 'descripción',
    list: 'Ordenes de pago',
    status: 'Estado',
    ownerable_type: 'Tipo de beneficiario',
    payment_date: 'Fecha',
    pending: 'Por pagar',
    coin_id: 'Moneda',
    entity_id: 'Entidad',
    ownerable_id: 'Beneficiario',
    operation_type_id: 'Tipo de operación',
    concept_id: 'Concepto',
    coin: 'Moneda',
    entity: 'Entidad',
    ownerable: 'Beneficiario',
    operation_type: 'Tipo de operación',
    concept: 'Concepto',
    update: 'Modificar',
    reset: 'Limpiar',
    cancel: 'Cancelar'
  },
  transaction: {
    addSuccessful: '¡Transferencia cargada exitosamente!'
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
  guide: {
    weight: 'peso',
    unit_of_measurement: 'unidad de medida',
    newGuide: 'nuevo guías',
    uploadSuccess: 'Archivos guardados exitosamente',
    swornDeclaration: 'Declaración Jurada',
    documents: 'documentos',
    add: 'agregar guías',
    provider: 'Proveedor',
    vehicle: 'Vehiculo',
    client: 'cliente',
    trailer: 'tráiler',
    driver: 'conductor',
    material: 'material',
    start_date: 'fecha de inicio',
    deadline: 'fecha de cierre',
    origin_address: 'dirección de origen',
    destination_address: 'dirección de destino',
    code_runpa: 'código de runpa',
    update: 'Modificar',
    created_at: 'fecha',
    list: 'Lista de guías',
    description: 'descripción',
    saveSuccess: 'guías creado exitosamente',
    deleteSuccessful: 'eliminado exitosamente',
    editSuccessful: 'Modificado exitosamente',
    addSuccessful: 'Agregado exitosamente',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    name: 'nombre',
    concept_type: 'Tipo de guías'
  },
  organization: {
    close: 'cerrar',
    filter: 'Filtros',
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
    contract_number: 'N° Contrato',
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
