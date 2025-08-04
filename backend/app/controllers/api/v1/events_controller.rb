class Api::V1::EventsController < ApplicationController
  before_action :set_event, only: [:show, :update, :destroy]

  # GET /api/v1/events
  def index
    @events = Event.includes(:participants).by_date
    
    # Filtrar por fecha si se proporciona
    @events = @events.where('date >= ?', params[:from_date]) if params[:from_date].present?
    @events = @events.where('date <= ?', params[:to_date]) if params[:to_date].present?
    
    # Filtrar solo eventos futuros si se solicita
    @events = @events.upcoming if params[:upcoming] == 'true'
    
    render json: @events.map { |event| event_json(event) }
  end

  # GET /api/v1/events/:id
  def show
    render json: event_json(@event, include_participants: true)
  end

  # POST /api/v1/events
  def create
    @event = Event.new(event_params)
    
    if @event.save
      render json: event_json(@event), status: :created
    else
      render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /api/v1/events/:id
  def update
    if @event.update(event_params)
      render json: event_json(@event)
    else
      render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/events/:id
  def destroy
    @event.destroy
    head :no_content
  end

  private

  def set_event
    @event = Event.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Evento no encontrado' }, status: :not_found
  end

  def event_params
    params.require(:event).permit(:title, :description, :date, :location)
  end

  def event_json(event, include_participants: false)
    json = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      participants_count: event.participants.count,
      created_at: event.created_at,
      updated_at: event.updated_at
    }
    
    if include_participants
      json[:participants] = event.participants.map do |participant|
        {
          id: participant.id,
          name: participant.name,
          email: participant.email,
          created_at: participant.created_at
        }
      end
    end
    
    json
  end
end
