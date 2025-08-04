class Participant < ApplicationRecord
  belongs_to :event
  
  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email, uniqueness: { scope: :event_id, message: "ya está registrado para este evento" }
end
