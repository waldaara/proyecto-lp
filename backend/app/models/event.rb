class Event < ApplicationRecord
  has_many :participants, dependent: :destroy
  
  validates :title, presence: true, length: { maximum: 255 }
  validates :description, presence: true
  validates :date, presence: true
  validates :location, presence: true, length: { maximum: 255 }
  
  scope :upcoming, -> { where('date >= ?', Time.current) }
  scope :by_date, -> { order(:date) }
end
