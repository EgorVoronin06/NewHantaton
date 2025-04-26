// services/notification.go
func (ns *NotificationService) MonitorRoutes(bot *telebot.Bot) {
	ticker := time.NewTicker(1 * time.Minute)
	
	for range ticker.C {
		subscriptions := ns.repo.GetActiveSubscriptions()
		
		for _, sub := range subscriptions {
			eta := ns.CalculateETA(sub.Route, sub.Stop)
			user := ns.repo.GetUserByID(sub.UserID)
			
			if shouldNotify(user, eta) {
				sendNotification(bot, user, eta)
			}
		}
	}
}

func (ns *NotificationService) CalculateETA(route models.Route, stop models.Stop) time.Time {
	// Реальная реализация с интеграцией API ГЛОНАСС
	// Временная реализация с mock-данными
	return time.Now().Add(time.Duration(rand.Intn(15)+5) * time.Minute)
}
