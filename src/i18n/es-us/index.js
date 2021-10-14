// This is just an example,
// so you can safely delete all default props below

export default {
  registros: 'Registro',
  lastname: 'apellido',
  template: {
    inventory: 'inventario',
    search: 'buscar',
    security: 'seguridad',
    add: 'agregar',
    restore: 'restaurar',
    cancel: 'cancelar',
    organization: 'organización',
    actions: 'acciones',
    billing: 'facturación',
    errorSearchProduct: 'producto no encontrado!',
    noResults: 'sin resultados',
    confirm: 'aceptar',
    messageSistem: 'mensaje del sistema',
    darkMode: 'modo oscuro',
    active: 'activar',
    desactive: 'desactivar',
    error: 'algo salio mal!',
    code: 'Código',
    sucursales: 'sucursales',
    sales: 'ventas',
    errorDocumentNumber: 'Documento invalido',
    purchase: 'compras',
    settings: 'Configuración'
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
    products: 'productos',
    budgetRequest: 'solicitud de cotización',
    provider: 'proveedores',
    users: 'usuarios',
    business: 'empresas',
    modules: 'modulos',
    expense: 'gastos diversos',
    permissions: 'permisos',
    roles: 'roles',
    name: 'nombre',
    route: 'ruta',
    category_module: 'Categoria',
    listModule: 'lista de modulos',
    'branch-offices': 'establecimientos',
    newBilling: 'nuevo factura',
    billing: 'facturas',
    categories: 'categorias',
    brands: 'marcas',
    clients: 'clientes',
    productCommissions: 'Comision de productos',
    sellerCommissions: 'Comision de vendedores',
    'checking-accounts': 'cuenta corrinte',
    'voucher-list': 'listado de comprobantes',
    orders: 'Pedidos',
    quotations: 'cotización',
    newPurchase: 'nueva compra',
    purchase: 'lista compras',
    transfer: 'traslados',
    movements: 'movimientos',
    devolutions: 'Devoluciones',
    inventory: 'reporte inventario',
    kardex_valued: 'kardex valorizado',
    kardex: 'kardex'
  },

  order: {
    newOrder: 'nuevo pedido',
    createBill: 'Facturar',
    client: 'cliente',
    operation_type: 'tipo de venta',
    code: 'código',
    coin: 'Moneda',
    saveSuccess: 'perdido creado exitosamente!',
    voucher_type: 'tipo comprobante',
    created_at: 'fecha',
    list: 'lista de pedidos',
    total: 'total',
    cash: 'efectivo',
    cancelOrder: 'cancelar perdido',
    saveOrder: 'guardar perdido',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    seller: 'vendedor',
    igv: 'igv',
    download: 'descargas',
    XML: 'XML',
    PDF: 'PDF',
    CDR: 'CDR',
    payment: 'pagos',
    options: 'opciones',
    note: 'Nota',
    guide: 'guía'
  },

  quotation: {
    createBill: 'facturar',
    newQuotation: 'nuevo cotización',
    client: 'cliente',
    operation_type: 'tipo de venta',
    code: 'código',
    coin: 'Moneda',
    shipping_address: 'dirección de entrega',
    validity_time: 'tiempo de validación',
    delivery_time: 'tiempo de entrega',
    saveSuccess: 'cotización creado exitosamente!',
    voucher_type: 'tipo comprobante',
    created_at: 'fecha',
    list: 'lista de cotizaciones',
    total: 'total',
    cash: 'efectivo',
    cancelOrder: 'cancelar cotización',
    saveOrder: 'guardar cotización',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    seller: 'vendedor',
    igv: 'igv',
    download: 'descargas',
    XML: 'XML',
    PDF: 'PDF',
    CDR: 'CDR',
    payment: 'pagos',
    options: 'opciones',
    note: 'Nota',
    guide: 'guía'
  },

  // permissions
  permissions: {
    acronym: 'acrónimo',
    name: 'nombre',
    listPermission: 'lista de permisos'
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

  // business
  business: {
    document: 'documento',
    name: 'nombre',
    address: 'dirección',
    number_phone: 'telefono',
    listBusiness: 'lista de empresas',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar'
  },

  // business
  branchOffice: {
    name: 'nombre',
    description: 'descripcion',
    number_phone: 'telefono',
    list: 'lista de sucursales',
    business: 'empresa',
    add: 'agregar establecimiento',
    restore: 'restaurar',
    reset: 'limpiar',
    cancel: 'cancelar',
    update: 'modificar'
  },

  guide: {
    saveSuccess: 'Guia guardada exitosamente!',
    saveError: 'Error al guardar'
  },

  billing: {
    serie_id: 'serie',
    series: 'series',
    id: 'serie',
    saveErrorPayment: 'Ingrese los campos requeridos',
    saveSuccessPayment: 'pago guarado exitosamente!',
    client: 'cliente',
    operation_type: 'tipo de venta',
    code: 'código',
    coin: 'Moneda',
    saveSuccess: 'factura creada exitosamente!',
    voucher_type: 'tipo comprobante',
    created_at: 'fecha',
    list: 'lista de facturas',
    total: 'total',
    cash: 'efectivo',
    cancelBilling: 'cancelar factura',
    saveBilling: 'guardar factura',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    seller: 'vendedor',
    igv: 'igv',
    download: 'descargas',
    XML: 'XML',
    PDF: 'PDF',
    CDR: 'CDR',
    payment: 'pagos',
    options: 'opciones',
    note: 'Nota',
    guide: 'guía',
    newBilling: 'Nueva factura'
  },
  purchase: {
    products: 'productos',
    serie: 'serie',
    id: 'serie',
    saveErrorPayment: 'Ingrese los campos requeridos',
    saveSuccessPayment: 'pago guarado exitosamente!',
    provider: 'proveedor',
    operation_type: 'tipo de venta',
    code: 'código',
    coin: 'Moneda',
    saveSuccess: 'compra creada exitosamente!',
    voucher_type: 'tipo comprobante',
    created_at: 'fecha',
    list: 'lista de compras',
    total: 'total',
    cash: 'efectivo',
    cancelBilling: 'cancelar compra',
    saveBilling: 'guardar compra',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    seller: 'vendedor',
    igv: 'igv',
    download: 'descargas',
    XML: 'XML',
    PDF: 'PDF',
    CDR: 'CDR',
    payment: 'pagos',
    options: 'opciones',
    note: 'Nota',
    guide: 'guía',
    newPurchase: 'Nueva compra'
  },
  transfer: {
    to_warehouse: 'Almacen destino',
    from_warehouse: 'Almacen inicial',
    amount: 'Cantidad de productos',
    created_at: 'Fecha de traslado',
    list: 'lista de traslados',
    options: 'opciones',
    products: 'productos',
    fromWarehouse: 'Almacen inicial',
    toWarehouse: 'Almacen destino',
    newTransfer: 'nuevo traslado'
  },
  devolution: {
    created_at: 'Fecha',
    list: 'lista de devoluciones',
    options: 'opciones',
    products: 'productos',
    user: 'usuario',
    code: 'Devolución',
    devolution_reason: 'motivo',
    devolutionReason: 'motivo',
    observation: 'observación',
    newDevolution: 'nueva devolución',
    saveSuccess: 'devolución creada exitosamente'
  },

  kardexReport: {
    created_at: 'Fecha y hora de transacción',
    list: 'Consulta kardex',
    amount: 'Entrada + / Salida -',
    product: 'producto',
    transaction_type: 'Tipo de transacción',
    stock: 'saldo'
  },

  inventoryReport: {
    created_at: 'Fecha y hora de transacción',
    list: 'Consulta de inventarios',
    product: 'producto',
    brand: 'marca',
    warehouse_name: 'almacén',
    stock_product: 'Stock',
    category: 'categoria',
    purchase_price: 'precio de compra',
    sale_price: 'precio de venta'
  },

  movement: {
    created_at: 'Fecha y hora de transacción',
    list: 'Listado de Inventario',
    category: 'categoria',
    product: 'producto',
    purchase_price: 'Costo',
    sale_price: 'precio de venta',
    brand: 'marca',
    warehouse_name: 'almacén',
    stock_product: 'Stock actual',
    translate: 'Trasladar'
  },

  kardexValued: {
    created_at: 'Fecha y hora de transacción',
    list: 'Kardex valorizado',
    category: 'categoria',
    product: 'producto',
    purchase_price: 'Costo',
    sale_price: 'precio de venta',
    brand: 'marca',
    warehouse_name: 'almacén',
    stock_product: 'Stock actual',
    translate: 'Trasladar',
    stock: 'Stock',
    physicalUnitsSold: 'Unidades fisicas vendidas'
  },

  expense: {
    products: 'productos',
    serie: 'serie',
    id: 'serie',
    expense_reason: 'motivo de gasto',
    saveErrorPayment: 'Ingrese los campos requeridos',
    saveSuccessPayment: 'pago guarado exitosamente!',
    provider: 'proveedor',
    operation_type: 'tipo de venta',
    code: 'código',
    coin: 'Moneda',
    saveSuccess: 'gasto creada exitosamente!',
    expenseReason: 'motivo del gasto',
    created_at: 'fecha',
    list: 'lista de gastos diversos',
    total: 'total',
    cash: 'efectivo',
    cancelBilling: 'cancelar gasto',
    saveBilling: 'guardar gasto',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    seller: 'vendedor',
    igv: 'igv',
    download: 'descargas',
    XML: 'XML',
    PDF: 'PDF',
    CDR: 'CDR',
    payment: 'pagos',
    options: 'opciones',
    note: 'Nota',
    guide: 'guía',
    newExpense: 'Nuevo gasto diverso'
  },
  budgetRequest: {
    products: 'productos',
    serie: 'serie',
    id: 'serie',
    provider: 'proveedor',
    coin: 'Moneda',
    saveSuccess: 'solicitud creada exitosamente!',
    expenseReason: 'motivo del solicitud',
    created_at: 'fecha',
    list: 'lista de solicitud de cotizaciones',
    total: 'total',
    cash: 'efectivo',
    cancelBilling: 'cancelar solicitud',
    saveBilling: 'guardar solicitud',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    seller: 'vendedor',
    igv: 'igv',
    download: 'descargas',
    XML: 'XML',
    PDF: 'PDF',
    CDR: 'CDR',
    payment: 'pagos',
    options: 'opciones',
    note: 'Nota',
    guide: 'guía',
    newBudgetRequest: 'Nueva solicitud cotización'
  },
  creditNote: {
    saveSuccess: 'nota de credito creada exitosamente!',
    voucherTypeNotes: 'tipos comprobante',
    typeOfCreditNotes: 'tipos de notas de credito',
    created_at: 'fecha',
    list: 'lista de nota de creditos',
    total: 'total',
    cash: 'efectivo',
    cancelBilling: 'cancelar nota de credito',
    saveBilling: 'guardar nota de credito',
    error: 'A ocurrido un error',
    expiration_date: 'fecha de expiración',
    seller: 'vendedor',
    igv: 'igv',
    download: 'descargas',
    XML: 'XML',
    PDF: 'PDF',
    CDR: 'CDR',
    payment: 'pagos',
    options: 'opciones',
    note: 'Nota',
    guide: 'guía',
    newCreditNote: 'Nueva nota de credito'
  },
  arching: {
    notFound: 'Arqueo cerrado, pongase en contacto con el administrador'
  },
  category: {
    name: 'nombre',
    description: 'descripción',
    add: 'agregar categoría',
    list: 'Lista de categorías',
    addSuccessfull: 'Categoría agregada exitosamente',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessfull: 'Categoría eliminada exitosamente',
    update: 'Editar Categoría',
    editSuccessfull: 'Categoría editada exitosamente'
  },
  product: {
    margin_percentage: '% Margen',
    filter: 'filtros',
    stock: 'stock',
    brand_id: 'marca',
    brand: 'marca',
    category_id: 'categoria',
    category: 'categoria',
    supsec: 'supsec',
    code: 'código',
    numsec: 'numsec',
    description: 'nombre',
    add: 'agregar producto',
    list: 'Lista de productos',
    addSuccessfull: 'Producto agregada exitosamente',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessfull: 'Producto eliminada exitosamente',
    update: 'Editar Producto',
    editSuccessfull: 'Producto editada exitosamente'
  },
  brand: {
    name: 'nombre',
    description: 'descripción',
    add: 'agregar marca',
    list: 'Lista de marcas',
    addSuccessfull: 'marca agregada exitosamente',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessfull: 'Marca eliminada exitosamente',
    update: 'Editar Marca',
    editSuccessfull: 'Marca editada exitosamente'
  },
  productCommission: {
    product: 'producto',
    product_id: 'producto',
    add: 'agregar comisión',
    list: 'Lista de comisiones',
    addSuccessfull: 'comisión agregada exitosamente',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessfull: 'Comisión eliminada exitosamente',
    update: 'Editar Comisión',
    editSuccessfull: 'Comisión editada exitosamente',
    amount: 'monto',
    commission_type_select: 'Tipo de comisión',
    commission_type: 'Tipo de comisión'
  },
  sellerCommission: {
    seller: 'vendedor',
    seller_id: 'vendedor',
    add: 'agregar comisión',
    list: 'Lista de comisiones',
    addSuccessfull: 'comisión agregada exitosamente',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessfull: 'Comisión eliminada exitosamente',
    update: 'Editar Comisión',
    editSuccessfull: 'Comisión editada exitosamente',
    amount: 'monto',
    commission_type_select: 'Tipo de comisión',
    commission_type: 'Tipo de comisión'
  },
  client: {
    name: 'nombre',
    last_name: 'apellido',
    add: 'agregar cliente',
    list: 'Lista de clientes',
    addSuccessfull: 'cliente agregada exitosamente',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessfull: 'Cliente eliminada exitosamente',
    update: 'Editar Cliente',
    editSuccessfull: 'Cliente editada exitosamente',
    document_number: 'número Doc.',
    email: 'correo',
    phone: 'telefono',
    document_type_id: 'tipo de Doc.',
    document_type: 'tipo de Doc.',
    client_type: 'tipo de cliente',
    client_type_id: 'tipo de cliente'
  },
  provider: {
    name: 'nombre',
    last_name: 'apellido',
    status: 'Estado',
    residence_condition: 'Condición de residencia',
    add: 'agregar proveedor',
    list: 'Lista de proveedores',
    addSuccessfull: 'proveedor agregada exitosamente',
    reset: 'limpiar',
    cancel: 'cancelar',
    deleteSuccessfull: 'proveedor eliminada exitosamente',
    update: 'Editar proveedor',
    editSuccessfull: 'proveedor editada exitosamente',
    document_number: 'número Doc.',
    email: 'correo',
    phone: 'telefono',
    document_type_id: 'tipo de Doc.',
    document_type: 'tipo de Doc.',
    client_type: 'tipo de proveedor',
    client_type_id: 'tipo de proveedor'
  },
  entryAndExitOfMoney: {
    monto: 'monto',
    descripcion: 'descripcion',
    add: 'agregar entrada/salida dinero',
    entryAndExitOfMoneySuccess: 'operación realizada exitosamente!',
    tipo_operacion: 'tipo de operación',
    reset: 'limpiar',
    cancel: 'cancelar'
  }
}
