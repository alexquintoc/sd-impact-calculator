import type { BriefSeed } from './brief-generator-data'

// Keyed by the source title so reordering the catalog cannot mix translations.
export const spanishBriefs: Record<string, Pick<BriefSeed, 'title' | 'projectType' | 'brief' | 'tags'>> = {
  'Solar-Powered Online Publication': {
    title: 'Publicación digital con energía solar', projectType: 'publicación digital',
    brief: 'Diseña una publicación digital sobre el clima que use alojamiento web con energía renovable, publique el consumo energético de cada artículo y encargue a ilustradores locales explicar iniciativas de reparación, reúso y adaptación.',
    tags: ['energía', 'diseño editorial', 'educación climática'],
  },
  'Park-Feeding Food Packaging': {
    title: 'Empaques que nutren los parques', projectType: 'sistema de empaques para alimentos',
    brief: 'Diseña un sistema de empaques para comida para llevar, hechos de fibra compostable, con mapas de puntos de recolección en parques, tinta que no dañe las semillas y un circuito de recolección que transforme los residuos de comida en abono para las áreas verdes del barrio.',
    tags: ['empaques', 'composta', 'parques'],
  },
  'Recyclable Exhibition In A Box': {
    title: 'Exposición reciclable en una caja', projectType: 'exposición itinerante',
    brief: 'Diseña una exposición itinerante que se transporte desarmada en cajas que también sirvan como exhibidores, use paneles de un solo material e incluya actividades para que los visitantes evalúen los residuos de su escuela o lugar de trabajo.',
    tags: ['exposición', 'diseño desmontable', 'evaluación de residuos'],
  },
  'Carbon-Literate Social Detox': {
    title: 'Una pausa de redes con conciencia climática', projectType: 'campaña en redes sociales',
    brief: 'Diseña una campaña para descansar de las redes sociales que sustituya una semana de navegación por retos imprimibles en el barrio, recordatorios de bajo consumo de datos y compensaciones de emisiones verificadas para cada grupo participante.',
    tags: ['redes sociales', 'bienestar', 'compensación de emisiones'],
  },
  'Sun-Powered Indigenous Practices Film': {
    title: 'Saberes indígenas filmados con energía solar', projectType: 'video documental',
    brief: 'Diseña una serie de cortos documentales sobre prácticas indígenas locales de cuidado de la tierra. Usa equipos solares portátiles durante la producción y publica los videos con subtítulos, créditos y materiales didácticos aprobados por la comunidad.',
    tags: ['documental', 'energía solar', 'saberes indígenas'],
  },
  'Heat-Safe Wayfinding System': {
    title: 'Señalización para protegerse del calor', projectType: 'sistema de orientación y señalización',
    brief: 'Diseña un sistema de orientación peatonal que ubique sombra, agua potable, interiores frescos y paradas de autobús, mediante señales duraderas de bajo consumo de tinta en rutas especialmente expuestas al calor.',
    tags: ['señalización', 'adaptación al calor', 'espacio público'],
  },
  'Repair-First Product Label': {
    title: 'Etiquetas que facilitan la reparación', projectType: 'etiqueta de producto',
    brief: 'Diseña una etiqueta de producto que muestre la dificultad de reparación, la disponibilidad de refacciones, el origen de los materiales y las opciones al final de su vida útil con la misma claridad que la información nutrimental de un alimento.',
    tags: ['etiquetado', 'reparación', 'materiales'],
  },
  'Rainwater Festival Identity': {
    title: 'Identidad para un festival de agua de lluvia', projectType: 'sistema de identidad para eventos',
    brief: 'Diseña la identidad de un festival de agua de lluvia con mantas reutilizables, señalización de estaciones de recarga de agua y un sistema de boletaje que financie la instalación de pequeñas cisternas después del evento.',
    tags: ['evento', 'agua', 'reúso'],
  },
  'Low-Bandwidth Climate Report': {
    title: 'Informe climático de bajo consumo de datos', projectType: 'informe digital',
    brief: 'Diseña un informe digital de bajo consumo de datos que convierta información sobre riesgos climáticos en gráficas de carga rápida, carteles descargables y listas de verificación para urbanistas y habitantes del barrio.',
    tags: ['informe', 'bajo consumo de datos', 'riesgo climático'],
  },
  'Circular Pop-Up Swap Installation': {
    title: 'Instalación temporal de intercambio circular', projectType: 'instalación temporal',
    brief: 'Diseña una instalación temporal y modular donde los vecinos intercambien artículos del hogar, aprendan reparaciones sencillas y consulten un contador de los residuos que se han evitado enviar al relleno sanitario.',
    tags: ['instalación', 'intercambio', 'reparación'],
  },
  'Biodiversity Museum Labels': {
    title: 'Cédulas de museo para cuidar la biodiversidad', projectType: 'sistema de cédulas de museo',
    brief: 'Diseña un sistema de cédulas de museo que relacione los ejemplares exhibidos con tareas de restauración de hábitats locales, rutas de ciencia ciudadana y pequeñas acciones que los visitantes puedan realizar en una semana.',
    tags: ['museo', 'biodiversidad', 'ciencia ciudadana'],
  },
  'Accessible Clinic Toolkit': {
    title: 'Materiales accesibles para clínicas', projectType: 'conjunto de materiales de salud pública',
    brief: 'Diseña materiales de salud pública para clínicas con tarjetas en lenguaje claro, carteles multilingües y recordatorios de citas, en colaboración con pacientes que suelen perder consultas por motivos de costo, trabajo o transporte.',
    tags: ['salud', 'accesibilidad', 'clínicas'],
  },
  'Community Cooling Archive': {
    title: 'Archivo comunitario para hacer frente al calor', projectType: 'archivo comunitario',
    brief: 'Diseña un archivo comunitario que reúna relatos de los habitantes sobre las olas de calor, ubique espacios informales para refrescarse y transforme los hallazgos en postales con propuestas de política pública y sesiones de escucha abiertas.',
    tags: ['archivo', 'calor', 'política pública'],
  },
  'Tenant Rights Poster Campaign': {
    title: 'Carteles sobre los derechos de quienes rentan', projectType: 'campaña de carteles',
    brief: 'Diseña una campaña de carteles sobre los derechos de quienes rentan vivienda, con recursos de asesoría legal en tiras desprendibles, traducciones para los vestíbulos de edificios y versiones de bajo consumo de datos accesibles mediante códigos QR en teléfonos antiguos.',
    tags: ['vivienda', 'carteles', 'derechos'],
  },
  'Food Pantry Wayfinding': {
    title: 'Señalización para un banco de alimentos', projectType: 'sistema de orientación y señalización',
    brief: 'Diseña un sistema de orientación para un banco de alimentos que proteja la privacidad, reduzca los tiempos de espera y ayude al voluntariado a orientar a los visitantes sin pedirles que repitan su información personal.',
    tags: ['acceso a alimentos', 'señalización', 'privacidad'],
  },
  'Caregiver Repair Manual': {
    title: 'Manual de reparación para personas cuidadoras', projectType: 'manual de reparación',
    brief: 'Diseña un manual de reparación de ayudas de movilidad donadas, con pasos ilustrados, información para conseguir refacciones y páginas de capacitación para voluntarios que ayuden a las personas cuidadoras a mantener los equipos en uso por más tiempo.',
    tags: ['cuidados', 'reparación', 'movilidad'],
  },
  'Mutual Aid Card Deck': {
    title: 'Tarjetas para organizar el apoyo mutuo', projectType: 'juego de tarjetas educativas',
    brief: 'Diseña un juego de tarjetas educativas que ayude a los grupos vecinales a planear funciones de apoyo mutuo, suministros compartidos, redes de comunicación y contactos de emergencia antes de que ocurra una crisis.',
    tags: ['apoyo mutuo', 'educación', 'emergencias'],
  },
  'Low-Bandwidth Benefits Website': {
    title: 'Sitio ligero para acceder a apoyos públicos', projectType: 'sitio web de bajo consumo de datos',
    brief: 'Diseña un sitio web de bajo consumo de datos que ayude a las familias a comparar apoyos públicos, reunir documentos e imprimir un plan de acción de una página en bibliotecas, escuelas y centros comunitarios.',
    tags: ['apoyos públicos', 'bajo consumo de datos', 'familias'],
  },
  'Youth Safety Social Campaign': {
    title: 'Campaña de seguridad para jóvenes', projectType: 'campaña en redes sociales',
    brief: 'Diseña una campaña de seguridad para jóvenes en redes sociales, creada junto con estudiantes, con videos cortos, tarjetas de compromiso imprimibles y enlaces a servicios locales, sin recurrir a mensajes basados en el miedo.',
    tags: ['juventud', 'seguridad', 'campaña'],
  },
  'Inclusive Hiring Digital Report': {
    title: 'Informe digital sobre contratación inclusiva', projectType: 'informe digital',
    brief: 'Diseña un informe digital que muestre a los empleadores cómo la contratación inclusiva influye en la permanencia del personal, con historias reales de trabajadores, gráficas claras y un presupuesto práctico para mejorar la accesibilidad.',
    tags: ['contratación', 'informe', 'accesibilidad'],
  },
  'Mobile Library Pop-Up': {
    title: 'Biblioteca móvil en las paradas de transporte', projectType: 'instalación temporal',
    brief: 'Diseña una biblioteca móvil temporal para paradas de transporte que preste libros, cargadores de teléfono y guías de servicios, y que recoja propuestas de los habitantes para futuras actividades del barrio.',
    tags: ['biblioteca', 'transporte', 'servicio público'],
  },
  'Accessible Ballot Explainer': {
    title: 'Guía electoral accesible', projectType: 'publicación digital',
    brief: 'Diseña una guía electoral accesible con resúmenes en audio, descargas en letra grande y traducciones comunitarias que ayuden a quienes votan por primera vez a comprender las propuestas locales.',
    tags: ['votación', 'accesibilidad', 'publicación'],
  },
  'Neighborhood Memory Archive': {
    title: 'Archivo de la memoria del barrio', projectType: 'archivo comunitario',
    brief: 'Diseña un archivo comunitario que conserve letreros de comercios, fotografías familiares, historias orales y mapas de migración antes de que la renovación urbana borre la memoria cotidiana del barrio.',
    tags: ['archivo', 'renovación urbana', 'memoria'],
  },
  'Indigenous Plant Label System': {
    title: 'Cédulas sobre saberes indígenas de las plantas', projectType: 'sistema de cédulas de museo',
    brief: 'Diseña un sistema de cédulas de museo sobre saberes indígenas de las plantas, con revisión de la comunidad, guías de pronunciación en sus lenguas y límites claros sobre qué conocimientos no deben extraerse ni comercializarse.',
    tags: ['museo', 'plantas', 'lenguas'],
  },
  'Festival Of Repair Identity': {
    title: 'Identidad para un festival de reparación', projectType: 'sistema de identidad para eventos',
    brief: 'Diseña la identidad de un festival de reparación que combine motivos artesanales locales, señalización para el préstamo de herramientas, perfiles de creadores y paquetes de patrocinio para negocios del barrio.',
    tags: ['festival', 'reparación', 'artesanía'],
  },
  'Language Access Card Deck': {
    title: 'Tarjetas para mejorar el acceso lingüístico', projectType: 'juego de tarjetas educativas',
    brief: 'Diseña un juego de tarjetas educativas que ayude a las instituciones públicas a evaluar el acceso en distintas lenguas, reconocer matices culturales y reescribir instrucciones confusas de servicios con personas revisoras de la comunidad.',
    tags: ['lenguas', 'servicio público', 'capacitación'],
  },
  'Street Vendor Documentary': {
    title: 'Documental sobre los saberes del comercio ambulante', projectType: 'video documental',
    brief: 'Diseña un documental sobre los saberes de vendedores ambulantes que combine retratos, mapas de recorridos, historias de alimentos y explicaciones de permisos para contribuir a su dignidad y a reformas legales.',
    tags: ['documental', 'comercio ambulante', 'cultura alimentaria'],
  },
  'Cultural Compost Packaging': {
    title: 'Empaques compostables con identidad cultural', projectType: 'empaques para alimentos',
    brief: 'Diseña una línea de empaques de alimentos para un mercado cultural que cuente el origen de los ingredientes, use materiales compostables y financie programas de aprendizaje para jóvenes de cocina y diseño.',
    tags: ['empaques', 'mercado', 'aprendizaje de oficios'],
  },
  'Heritage Walk Wayfinding': {
    title: 'Señalización para recorrer el patrimonio local', projectType: 'sistema de orientación y señalización',
    brief: 'Diseña un sistema de orientación para un recorrido patrimonial con placas bilingües, recuerdos en audio, mapas de rutas con sombra y cupones de pequeños negocios que mantengan la actividad peatonal en el barrio.',
    tags: ['señalización', 'patrimonio', 'comercio local'],
  },
  'Migration Story Poster Campaign': {
    title: 'Carteles que cuentan historias de migración', projectType: 'campaña de carteles',
    brief: 'Diseña una campaña de carteles que comparta historias de migración mediante retratos, objetos familiares y preguntas abiertas al público, y que conecte a las personas con recursos legales y culturales gestionados por la comunidad.',
    tags: ['migración', 'carteles', 'recursos comunitarios'],
  },
  'Living Recipe Online Publication': {
    title: 'Publicación digital de recetas vivas', projectType: 'publicación digital',
    brief: 'Diseña una publicación digital de recetas vivas donde personas mayores, agricultores y cocineros documenten saberes sobre alimentos de temporada mediante páginas de bajo consumo de datos y permisos claros para su reutilización.',
    tags: ['recetas', 'publicación', 'alimentos de temporada'],
  },
  'Ceremony-Safe Pop-Up Installation': {
    title: 'Instalación temporal que respeta las ceremonias', projectType: 'instalación temporal',
    brief: 'Diseña una instalación temporal para ceremonias culturales con mamparas modulares, reglas respetuosas para tomar fotografías, materiales reutilizables y una guía para anfitriones que promueva visitas sin apropiación de los saberes de la comunidad.',
    tags: ['instalación', 'ceremonias', 'orientación a visitantes'],
  },
  'Market-Ready Refill Label': {
    title: 'Etiqueta comercial para productos recargables', projectType: 'etiqueta de producto',
    brief: 'Diseña una etiqueta para un limpiador doméstico recargable que permita identificar desde el anaquel el costo del depósito, los puntos de recarga, las opciones de aroma y la reducción del impacto ambiental.',
    tags: ['recarga', 'etiqueta', 'venta al público'],
  },
  'Sponsor-Ready Impact Report': {
    title: 'Informe de impacto para atraer patrocinadores', projectType: 'informe digital',
    brief: 'Diseña un informe digital para patrocinadores de una organización de arte comunitario sin fines de lucro que muestre su alcance de público, gasto local, mejoras de accesibilidad y decisiones de producción con bajas emisiones de carbono.',
    tags: ['informe', 'patrocinio', 'artes'],
  },
  'Circular Loyalty Campaign': {
    title: 'Campaña de lealtad circular', projectType: 'campaña en redes sociales',
    brief: 'Diseña una campaña en redes sociales para una red de talleres de reparación que convierta las reparaciones recurrentes en recompensas de lealtad, difunda casos exitosos y facilite comparar los precios de los servicios.',
    tags: ['reparación', 'lealtad', 'precios'],
  },
  'Transit Retail Wayfinding': {
    title: 'Señalización para el comercio en estaciones', projectType: 'sistema de orientación y señalización',
    brief: 'Diseña un sistema de orientación en estaciones de transporte que dirija a los pasajeros hacia comercios locales, servicios públicos y puntos de recarga, y ofrezca espacios publicitarios accesibles a pequeños negocios.',
    tags: ['transporte', 'venta al público', 'comerciantes'],
  },
  'Subscription Repair Manual': {
    title: 'Manual de reparación por suscripción', projectType: 'manual de reparación',
    brief: 'Diseña un manual de reparación por suscripción para electrodomésticos compartidos, con diagnósticos ilustrados, paquetes de refacciones, calendarios de mantenimiento y un modelo de precios que premie una mayor vida útil del producto.',
    tags: ['suscripción', 'reparación', 'electrodomésticos'],
  },
  'Affordable Solar Kit Packaging': {
    title: 'Empaque para un equipo accesible de cocina solar', projectType: 'empaques para alimentos',
    brief: 'Diseña un empaque para un equipo accesible de cocina solar dirigido a vendedores de comida ambulante, con instrucciones resistentes al uso, información de financiamiento, diagramas de mantenimiento y ahorros de combustible claramente visibles.',
    tags: ['energía solar', 'comercio ambulante', 'empaques'],
  },
  'Pop-Up Marketplace Identity': {
    title: 'Identidad para un mercado temporal', projectType: 'sistema de identidad para eventos',
    brief: 'Diseña la identidad de un mercado temporal que ofrezca a pequeños comerciantes señalización compartida, cuotas transparentes, gráficos para separar residuos y plantillas de puestos reutilizables.',
    tags: ['mercado', 'pequeños comerciantes', 'reúso'],
  },
  'Investor Climate Card Deck': {
    title: 'Tarjetas sobre el clima para inversionistas', projectType: 'juego de tarjetas educativas',
    brief: 'Diseña un juego de tarjetas educativas que ayude a emprendedores a explicar los riesgos climáticos, el valor para sus clientes, los precios y las medidas de protección comunitaria en sus primeras conversaciones con inversionistas.',
    tags: ['inversión', 'riesgo climático', 'emprendimiento'],
  },
  'Lean Museum Membership Campaign': {
    title: 'Campaña de membresías de museo con recursos limitados', projectType: 'campaña de carteles',
    brief: 'Diseña una campaña de carteles para membresías de museo que venda pases comunitarios flexibles, destaque a artistas locales y explique cómo cada pase financia visitas escolares gratuitas.',
    tags: ['museo', 'membresías', 'escuelas'],
  },
  'Low-Cost Skills Website': {
    title: 'Sitio accesible para ofrecer habilidades locales', projectType: 'sitio web de bajo consumo de datos',
    brief: 'Diseña un sitio web de bajo consumo de datos para intercambios remunerados de habilidades en el barrio, con tarifas claras, señales de confianza, categorías de servicios y volantes impresos que integren a quienes no usan medios digitales.',
    tags: ['habilidades', 'bajo consumo de datos', 'economía local'],
  },
  'Revenue-Generating Public Health Toolkit': {
    title: 'Materiales de salud pública con ingresos sostenibles', projectType: 'conjunto de materiales de salud pública',
    brief: 'Diseña materiales de salud pública que las clínicas puedan adquirir con licencias accesibles, personalizar rápidamente y usar para reducir las citas perdidas mediante recordatorios impresos y plantillas de difusión adaptadas a cada contexto cultural.',
    tags: ['salud', 'licencias', 'plantillas'],
  },
}
