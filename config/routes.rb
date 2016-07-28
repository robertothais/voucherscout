Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/about' => 'pages#about'
  post '/subscribe' => 'pages#subscribe'
  root to: 'pages#home'
end
