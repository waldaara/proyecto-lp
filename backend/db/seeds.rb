# frozen_string_literal: true

# Limpiar datos existentes
puts "Limpiando datos existentes..."
Participant.destroy_all
Event.destroy_all

puts "Creando eventos de prueba..."

# Eventos futuros
event1 = Event.create!(
  title: "Minga de Limpieza del Parque Central",
  description: "Actividad comunitaria para la limpieza y mantenimiento del parque central de la ciudad. Incluye recolección de basura, poda de plantas y embellecimiento de espacios verdes.",
  date: 2.weeks.from_now.beginning_of_day + 9.hours,
  location: "Parque Central, Calle Principal #123, Centro de la Ciudad"
)

event2 = Event.create!(
  title: "Sembratón de Árboles Nativos",
  description: "Jornada de siembra de especies nativas en la zona rural para la recuperación de la biodiversidad local. Se proporcionarán herramientas y refrigerio.",
  date: 3.weeks.from_now.beginning_of_day + 8.hours,
  location: "Sector La Esperanza, km 15 vía rural hacia la montaña"
)

event3 = Event.create!(
  title: "Huerta Comunitaria - Taller de Compostaje",
  description: "Aprende a crear compost casero para tu huerta familiar. Taller práctico con expertos en agricultura sostenible.",
  date: 1.month.from_now.beginning_of_day + 14.hours,
  location: "Centro Comunitario La Unión, Barrio San José"
)

event4 = Event.create!(
  title: "Limpieza de Quebrada El Cristal",
  description: "Actividad de recuperación ambiental de la quebrada El Cristal. Incluye retiro de residuos sólidos y siembra de plantas acuáticas.",
  date: 5.weeks.from_now.beginning_of_day + 7.hours,
  location: "Quebrada El Cristal, entrada por el puente de la Calle 10"
)

# Evento pasado para pruebas
event5 = Event.create!(
  title: "Mercado Agroecológico Comunitario (Pasado)",
  description: "Feria de productos orgánicos y artesanales de la región. Apoyo a productores locales y consumo consciente.",
  date: 1.week.ago.beginning_of_day + 10.hours,
  location: "Plaza del Mercado, Centro Histórico"
)

puts "Creando participantes de prueba..."

# Participantes para el primer evento
Participant.create!([
  {
    name: "María Elena González Pérez",
    email: "maria.gonzalez@email.com",
    event: event1
  },
  {
    name: "Carlos Roberto Pérez Mendoza",
    email: "carlos.perez@email.com",
    event: event1
  },
  {
    name: "Ana Lucía Rodríguez Silva",
    email: "ana.rodriguez@email.com",
    event: event1
  },
  {
    name: "José Miguel Torres Vargas",
    email: "jose.torres@email.com",
    event: event1
  }
])

# Participantes para el segundo evento
Participant.create!([
  {
    name: "Laura Patricia Jiménez Castro",
    email: "laura.jimenez@email.com",
    event: event2
  },
  {
    name: "Diego Alejandro Morales Ruiz",
    email: "diego.morales@email.com",
    event: event2
  },
  {
    name: "Carmen Rosa Delgado Herrera",
    email: "carmen.delgado@email.com",
    event: event2
  }
])

# Participantes para el tercer evento
Participant.create!([
  {
    name: "Ricardo Manuel Vásquez León",
    email: "ricardo.vasquez@email.com",
    event: event3
  },
  {
    name: "Sandra Milena Castillo Mora",
    email: "sandra.castillo@email.com",
    event: event3
  }
])

# Un participante para el cuarto evento
Participant.create!(
  name: "Gabriel Fernando Ortiz Ramos",
  email: "gabriel.ortiz@email.com",
  event: event4
)

# Participantes para el evento pasado
Participant.create!([
  {
    name: "Beatriz Elena Guerrero Sánchez",
    email: "beatriz.guerrero@email.com",
    event: event5
  },
  {
    name: "Fernando José Ramírez Aguilar",
    email: "fernando.ramirez@email.com",
    event: event5
  },
  {
    name: "Claudia Esperanza Vargas Mejía",
    email: "claudia.vargas@email.com",
    event: event5
  }
])

puts "Datos de prueba creados exitosamente!"
puts ""
puts "Resumen:"
puts "- #{Event.count} eventos creados"
puts "- #{Participant.count} participantes registrados"
puts "- #{Event.upcoming.count} eventos futuros"
puts "- #{Event.where('date < ?', Time.current).count} eventos pasados"
puts ""
puts "Eventos futuros:"
Event.upcoming.order(:date).each_with_index do |event, index|
  puts "#{index + 1}. #{event.title} - #{event.date.strftime('%d/%m/%Y %H:%M')} - #{event.participants.count} participantes"
end