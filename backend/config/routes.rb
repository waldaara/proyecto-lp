Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # API routes
  namespace :api do
    namespace :v1 do
      # Events resources with nested participants
      resources :events do
        resources :participants, only: [:index, :create]
      end
      
      # Direct access to participants
      resources :participants, only: [:show, :destroy]
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API Documentation routes
  get "api/docs" => "api_docs#index", as: :api_docs
  get "api/docs/raw" => "api_docs#raw", as: :api_docs_raw

  # Defines the root path route ("/")
  root "api_docs#index"
end
