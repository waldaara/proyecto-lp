class Api::V1::ParticipantsController < ApplicationController
  before_action :set_event, only: [:index, :create]
  before_action :set_participant, only: [:show, :destroy]

  # GET /api/v1/events/:event_id/participants
  def index
    @participants = @event.participants.order(:created_at)
    render json: @participants.map { |participant| participant_json(participant) }
  end

  # GET /api/v1/participants/:id
  def show
    render json: participant_json(@participant, include_event: true)
  end

  # POST /api/v1/events/:event_id/participants
  def create
    @participant = @event.participants.build(participant_params)
    
    if @participant.save
      render json: participant_json(@participant), status: :created
    else
      render json: { errors: @participant.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/participants/:id
  def destroy
    @participant.destroy
    head :no_content
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Evento no encontrado' }, status: :not_found
  end

  def set_participant
    @participant = Participant.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Participante no encontrado' }, status: :not_found
  end

  def participant_params
    params.require(:participant).permit(:name, :email)
  end

  def participant_json(participant, include_event: false)
    json = {
      id: participant.id,
      name: participant.name,
      email: participant.email,
      event_id: participant.event_id,
      created_at: participant.created_at,
      updated_at: participant.updated_at
    }
    
    if include_event
      json[:event] = {
        id: participant.event.id,
        title: participant.event.title,
        date: participant.event.date,
        location: participant.event.location
      }
    end
    
    json
  end
end
