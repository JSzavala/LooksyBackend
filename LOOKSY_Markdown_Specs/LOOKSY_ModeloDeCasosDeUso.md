# LOOKSY_ModeloDeCasosDeUso

INSTITUTO TECNOLÓGICO SUPERIOR DEL SUR DE GUANAJUATO

Modelo de casos de uso

Proyecto: Looksy

Alumnos:

Dafne Guadalupe Orozco Aguirre

Montserrat Tenorio Villagomez

Guadalupe Yolet Villagomez Nuñez

Jesus Samuel Zavala Ayala

Materia: Ingeniería de software

Profesor: Fernando Jose Martínez López

Semestre: 6to

Especialidad: Sistemas computacionales

Uriangato, Gto.                                                                         Fecha: 03/02/2026

Índice

# Diagramas de caso de uso

# Redacción de los casos de uso en formato breve

# Casos de uso del usuario

## Registrarse:

El usuario ingresa a la plataforma, entra a la pestaña de login donde puede iniciar o registrar su cuenta, al no tener una elige la opción de registrarse donde lo lleva a otra ventana en la que se muestran dos tipos de cuenta (proveedor o usuario), elige la de usuario donde se le pedirá rellenar los campos solicitados nombre de usuario (único) y contraseña, al completar los campos elige presionar el icono de registro y su cuenta se crea exitosamente para comenzar a interactuar.

## Filtrar productos:

El cliente al ingresar en la plataforma podrá ir a una pestaña donde se desplegarán opciones sobre aquellos productos en los que su interés resalte, cada artículo será etiquetado en una categoría, color y precio lo que hará que al elegir sus preferencias aquellos productos que hayan sido etiquetados con las características seleccionadas serán los que se muestran.

## Compra de productos:

El usuario después de ver el feed, puede agregar productos que desea comprar a su carrito de compra, y una vez está listo inicia el proceso de compra y se notifica a los vendedores sobre la nueva venta. El dinero involucrado en la compra de productos será retenido por la aplicación hasta que el cliente reciba su producto.

## Añadir productos al carrito:

El usuario podrá agregar los productos que desea comprar en su carrito de compras, con el objetivo de que el usuario pueda navegar libremente por la plataforma mientras elige los productos que comprará, y en todo momento el usuario podrá consultar su carrito de compras para ver los detalles sobre la compra a realizar.

Registrar intereses:

El usuario al ingresar en la plataforma, antes de mostrarle los productos se habilitará un cuestionario acerca de sus intereses como el estilo que le gusta y sus preferencias en los artículos para que, al concluir con el cuestionario lo que aparezca en su feed sean productos relacionados con sus preferencias.

## Publicar outfits:

El usuario tendrá la posibilidad de que con una cuenta ya creada pueda subir fotos a su perfil donde pueda mostrar los productos que adquirió y como decidió combinarlos, junto a una mención donde se muestre de qué tienda fue adquirido el/los artículos, con el fin de que las fotos sirvan como publicidad a la tienda.

## Interactuar con otras publicaciones:

El usuario podrá interactuar con otras publicaciones que hagan los demás usuarios dentro de la aplicación, podrán comentar y reaccionar a estas publicaciones, además de conocer de qué tienda fueron adquiridos los productos mostrados.

## Revisar ubicación de la tienda:

El usuario podrá visualizar la dirección exacta de las tiendas de ropa en caso de que requiera asistir personalmente a la tienda, esto con el objetivo de facilitar la búsqueda de productos de su agrado y ahorrar tiempo en dicha búsqueda.

## Búsqueda de productos:

El usuario podrá acceder al apartado de búsqueda de productos o bien de tiendas con el objetivo de visualizar los productos de su interés, esto con el fin de facilitar las compras del cliente y que se muestren opciones variadas de los posibles productos que requiere.

# Casos de uso proveedores

Registrarse: El proveedor al ingresar a la plataforma, entra a la pestaña de login donde puede iniciar o registrar su cuenta, al no tener una cuenta, elige la opción de registrarse donde lo lleva a otra ventana en la que se muestran dos tipos de cuenta (proveedor o usuario), elige la de proveedor en donde se le pedirá rellenar los campos solicitados nombre de usuario (único) y contraseña, además de que también se le pedirá que registre el nombre de su tienda y al completar todos los campos elige presionar el icono de registro y su cuenta se crea exitosamente para comenzar a subir sus productos.

## Registrar información de los productos:

El proveedor ingresa a una pestaña para cambiar la información alrededor de una prenda o accesorio como la disponibilidad, precio y descripción para mantener la información sobre las existencias actualizada en todo momento esto no incluye su stock.

## Actualizar Stock:

Dentro de las opciones del proveedor tendrá la opción de ir actualizando el stock dentro de la plataforma teniendo así el control de la cantidad de existencias del producto.

## Registrar contacto:

El proveedor deberá registrar su información de contacto para comunicación directa con la plataforma en caso de sea necesario resolver algún inconveniente con las ventas, esto incluye su número telefónico y nombre completo.

## Registrar dirección:

El proveedor deberá incluir datos de la tienda física donde se vende la mercancía, los datos a incluir son la dirección física de la tienda, número de contacto del establecimiento, y horario de atención.

## Añadir etiquetas:

El proveedor entra en un menú con distintas opciones de etiquetas para añadir a su mercancía, esto incluye su tienda en su totalidad o cada prenda en específico, las etiquetas van a ser estáticas para que la búsqueda de estos artículos sea más sencilla y los artículos puedan entrar en categorías por las que después podrán ser filtrados.

## Publicar productos:

Los proveedores podrán realizar la publicación de los productos que tienen actualmente en stock, para comenzar a promocionarlos dentro de la aplicación.

# Caso de uso en formato completo

## CU2: Venta de ropa.

Actor principal: Usuario/Cliente

Propósito principal:

El cliente al acceder a la página encontrará diversas opciones de productos y podrá visualizar reseñas de cada uno, también podrá buscar artículos disponibles de acuerdo a sus gustos.

Los vendedores podrán actualizar su tienda y subir todos los artículos que deseen para que los clientes puedan elegir de acuerdo a sus preferencias, además de que podrán llevar un registro de sus reseñas en plataforma y podrán elegir si realizarán ventas en línea.

Los creadores del sistema realizarán las actualizaciones e implementaciones necesarias para que la página funcione correctamente, escuchando siempre las quejas y sugerencias de los usuarios que lo utilizan y de los vendedores que utilizan la aplicación para vender sus productos.

Precondiciones:

El cliente deberá entrar al sistema con un usuario y contraseña, para que todas sus operaciones dentro de la aplicación puedan efectuarse de la mejor manera.

Los vendedores deben entrar también con sus credenciales de inicio de sesión para poder subir todos sus productos y además de esto deben seguir los lineamientos establecidos para poder vender dentro del sistema.

Postcondiciones:

Para realizar la venta de artículos el usuario deberá revisar si la tienda realiza ventas en línea y de ser así deberá revisar las políticas de entrega y de cambios de ropa que maneja la tienda, posteriormente el cliente podrá realizar la comprá mediante una transferencia.

Escenario principal de éxito:

El cliente llega a la aplicación y entra con sus datos.

El cliente busca los artículos de su interés y los agrega a su carrito de compras.

El cliente revisa las políticas de entrega y de devoluciones de la tienda

El cliente realiza la compra mediante un pago por transferencia, el dinero se retiene en la plataforma y se notifica al vendedor para que proceda con la entrega.

Una vez que el cliente recibe su pedido, se transfiere el dinero de la venta a la tienda y el cliente puede dar reseñas sobre los artículos que compró y además subir inspiraciones de outfits con sus prendas y accesorios.

Flujos alternativos:

El cliente crea su cuenta:

El sistema le permite seleccionar sus preferencias.

El sistema muestra productos de las tiendas relacionados con sus preferencias.

Una tienda crea su cuenta:

El sistema le permite publicar sus productos.

El sistema le ofrece la opción de activar sus permisos de venta.

El cliente desea comprar un producto:

El cliente revisa si la tienda realiza ventas en línea.

El cliente agrega el producto a su carrito de compras.

El sistema se prepara para llevar a cabo el proceso de pago, en donde se espera recibir la transferencia y actualizar la información de los productos.

Se realizó una venta:

Se notifica a la tienda los detalles sobre la nueva venta realizada y se retiene el dinero hasta que la tienda entrega el producto.

Una vez se entrega el producto el dinero es liberado a la tienda.

El sistema registra los datos de la venta exitosa y registra los detalles de los productos vendidos.

Hay rebajas en los artículo:

El sistema envía notificaciones a los seguidores de la cuenta con descuentos.

El sistema actualiza los precios en la base de datos.

Requisitos especiales:

Interfaz de cliente con un feed de inicio que tenga un diseño original y creativo, interesante para los usuarios.

Interfaz de vendedor con la opción de colocar nuevos productos en venta, modificar información, de forma fácil e intuitiva.

Políticas de uso, y términos para las tiendas que venderán productos mediante la aplicación.

Recuperación de problemas y fallos, manteniendo la integridad de la información y del cliente.

Temas abiertos:

¿Puede ser necesario personalizar las cuentas en el sistema que pertenecen a las tiendas?

¿Se firmará un contrato con las tiendas vendedoras?

¿El sistema creará alianzas con alguna paquetería para los envíos a distancia?

Indagar en la realización de transacciones para la venta de productos.

¿Qué propuestas de marketing se implementarán?

# Estilo informal.

## CU1: Comprar ropa.

Descripción:

A través de la aplicación generamos una forma de interaccion y comunicacion con CLIENTES interesados en la compra de productos textiles como ropa, accesorios y calzado, ofreciendo a dichos CLIENTES una amplia variedad de modelos en tendencia y de temporada, el CLIENTE podrá elegir las prendas o el producto que se a de su agrado y podrá adquirir dicho producto por medio de una compra en linea o bien en la sucursal de la tienda según las preferencias de los proveedores. Se orienta más en impulsar el comercio textil local.

Escenario principal:

El CLIENTE entra en la aplicación con sus credenciales de usuario y se encuentra con su feed en donde se mostrarán diferentes inspiraciones de outfits que pueden realizar con la ropa  que se encuentra en la página, posteriormente el CLIENTE escoge los productos o prendas que son más de su agrado y en caso de que desee comprarlos debe revisar si la tienda realiza ventas en línea y en caso de ser así, el cliente agrega los productos a su carrito de compras y procede a realizar el proceso de compra, una vez se realizan las operaciones necesarias la plataforma notifica a la tiendas sobre la venta y retiene el dinero hasta concretar la entrega del producto, y una vez se concreta la compra el cliente podrá subir sus reseñas y sus inspiraciones etiquetando a la tienda, y la tienda recibe el dinero por la venta de sus productos.

Escenario alternativo:

En caso de que el CLIENTE intente realizar una compra sin antes haber iniciado sesión o sin antes haber realizado el registro en la aplicación, la compra no podrá ser llevada a cabo, a menos que inicie sesión o bien en caso de no tener una cuenta, el CLIENTE pueda registrarse para crear su usuario y así poder continuar con el proceso de la compra.

En caso de que la tienda que público algún producto no esté dada de alta para realizar ventas desde la aplicación, el CLIENTE deberá contactarlos por otro medio o asistir a la tienda física.

CU2: Venta de ropa.

Descripción:

A través de la aplicación ofrecemos la posibilidad de que una TIENDA cree su cuenta y comience a publicar imágenes de las prendas, el calzado o los accesorios que tiene a la venta, con el objetivo de que los CLIENTES que tienen la aplicación puedan visualizar dichas prendas para que las mercancías lleguen a más gente de la localidad o de municipios cercanos. La aplicación permite que la TIENDA admita las ventas en línea o bien solo se muestre su información para que el CLIENTE asista personalmente en caso de que esté en sus posibilidades.

Escenario principal:

Una TIENDA crea su cuenta en la aplicación y puede comenzar a publicar imágenes de las prendas, el calzado y/o los accesorios que tiene disponibles, la TIENDA puede colocar los datos necesarios para que se realice la venta mediante transferencia bancaria o pago en físico desde la tienda. La TIENDA deberá encargarse de actualizar el estatus de la venta en caso de que sus ventas se realicen mediante pagos físicos. En caso de no querer utilizar la aplicación para proveer los datos para la transacción, la tienda podrá tener el acceso a publicar imágenes y el contacto personal para la venta de mercancías.

Escenario alternativo:

En el caso de que la TIENDA no tenga una cuenta no será posible comenzar a publicar imágenes e información sobre sus mercancías, a menos que la TIENDA cree su cuenta de vendedor.

Si la TIENDA creó su cuenta pero no está dada de alta para realizar ventas desde la aplicación no será posible realizar la venta y será necesario mandar la petición para dar de alta dicha tienda y así poder actualizar el perfil de la tienda para que pueda tener un contacto más directo con el cliente y poder realizar las ventas.

## CU3: Búsqueda.

Descripción: Al iniciar la aplicación en caso de que el usuario no tenga una cuenta, para poder comenzar se abrirá un apartado donde el usuario pueda hacer una selección de sus intereses como el tipo de prendas que busca, cuáles son los artículos de interés o el tipo de estética en las que se está interesado. Una vez, que termino su pequeño cuestionario de introduccion, al ingresar a la ventana principal, su feed se actualizará de acuerdo a los gustos que seleccionó, y con esto podrá tener las prendas y accesorios de su interes mucho mas a la vista para que pueda hacer sus compras, y también hacer la búsqueda de estas incluyendo buscar las tiendas a las que ya se les reconoce, así como palabras clave con las que se pueden filtrar los productos dependiendo de la categoría a la que pertenecen, para que su experiencia de compra sea más fácil y pueda buscar de una manera oportuna y encuentre lo que necesita fácilmente.

Escenario principal:

Un usuario puede entrar a la aplicación con o sin registro, en el caso de no contar con un registro previo se dará apertura a un tipo cuestionario donde se le pregunten sus intereses en prendas, colores, tipo o estética hacia la que se inclinan, donde al hacer la selección y terminar el cuestionario el feed de inicio se filtre conforme  las categorías que se añadieron, encontrando ideas que se le presentan sobre outfits que fueron etiquetados con lo que se busca, en caso de buscar alguna cosa en específico se dirige hacia la pestaña de despliegue donde podrá hacer la búsqueda de productos o seleccionar por categorías.

Una tienda al hacer el registro de un artículo deberá etiquetar el mismo con palabras clave de a qué categoría pertenece, entre otras que permitan que el producto pueda relacionarse con las búsquedas que hace un usuario.

Escenario alternativo:

Las palabras clave a las que se hace referencia no encuentran productos que concuerden con lo buscado, no coincidan en la formación de la cadena (mal escritas) o que la selección de intereses haya sido al azar.

Un usuario proveedor no ha ingresado las etiquetas correspondientes lo que hace que su producto no se recomiende con facilidad al no haber coincidencias con la búsqueda de los posibles usuarios interesados. El ingreso de etiquetas que no concuerden con el producto y hagan que no coincida con lo interesado.

Diagramas de Secuencia del Sistema (DSS)

Escenario de realizar una compra

Flujo Alternativo (Sin stock)

Flujo Alternativo (Tienda no registrada para vender)

Escenario de realizar buscar artículos

Flujo Alternativo (Tienda no registrada para vender)

# Contratos de operación

Contrato de operación 1

Operación: RegistrarTienda (logInactivo)

Referencias cruzada: Caso de uso: Registrarse

Precondiciones:

El tipo de cuenta seleccionado es “Proveedor”

Postcondiciones:

Se crea una instancia en tienda y se asoció los atributos del formulario.

Contrato de operación 2

Operación: RegistrarCliente(logInactivo)

Referencias cruzada: Caso de uso: Registrarse

Precondiciones:

El tipo de cuenta seleccionado es “Usuario”

Postcondiciones:

Se crea una instancia en cliente y se asocian los atributos del formulario.

Contrato de operación 3

Operación: Iniciar compra(idArticulo, idTienda, idUsuario).

Referencias cruzadas: Caso de uso: Compra de productos.

Precondiciones:

Existe stock disponible para todos los artículos asociados a la compra..

Postcondiciones:

Se creó una instancia de Compra y se asoció con tienda y usuario.

Contrato de operación 4

Operación: Solicitar compra(idCompra)

Referencias cruzada: caso de uso: iniciar compra

Precondiciones:

Hay una compra en curso asociada a una sesión activa de usuario.

El estado de la tienda es abierto.

Existe stock disponible para todos los artículos asociados a la compra..

El atributo en método de pago marca tarjeta.

Postcondiciones

Se creó una instancia de pago y se asoció con la compra actual.

El atributo estado de la compra se inicializó en “Retenido”

El atributo estado de la compra cambio a “Pendiente de envío”

Se creó una instancia de detallesVenta y se asoció con la compra.

Contrato de operación 5

Operación: Seleccionar productos()

Referencias cruzadas: Caso de uso: seleccionar productos(idArticulo).

Precondiciones:

Hay una compra en curso

El estado de la tienda es abierto.

El stock del artículo está disponible.

El carrito de compras está activo

Postcondiciones:

Se asoció el id Articulo de todos los productos seleccionados a la instancia de compra activa.

Excepciones:

Si se selecciona un producto sin stock se lanza la excepción sin Stock Exception

Contrato de operación 6

Operación: guardar preferencias(idUsuario)

Referencias cruzadas: caso de uso: registrar intereses

Precondiciones:

Hay una instancia de Usuario en curso

El usuario ya selecciono todas las preferencias

Postcondiciones:

Se le asignó las preferencias a la instancia de usuario

Contrato de operación 7

Operación: Publicar()

Referencias cruzadas: caso de uso: Publicar outfits

Precondiciones:

Tener una cuenta creada

haber realizado una compra exitosa en una tienda

Postcondiciones:

Se creo una instancia de Publicacion y se asoció con el usuario y la tienda

Contrato de operación 8

Operación:reaccionar(idUsuario,idPublicacion)

Referencias cruzadas: caso de uso: Interactuar con otras publicaciones

Precondiciones:

Tener una cuenta activa

Interactuar con un post no eliminado

Postcondiciones:

Se creó una instancia de reacción y se asoció con el usuario y la publicación

Contrato de operación 9

Operación: comentar(idUsuario,IdPublicacion)

Referencias cruzadas: caso de uso: Interactuar con otras publicaciones

Precondiciones:

Tener una cuenta activa

Interactuar con un Post no eliminado

Postcondiciones:

Se creó una instancia de comentario y se asoció con el usuario y la publicación

