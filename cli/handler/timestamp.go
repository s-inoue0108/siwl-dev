package handler

import "time"

func GetTimeStamp() time.Time {
	return time.Now().In(time.FixedZone("JST", 9*60*60))
}

func CastTimeStamp(timeObj time.Time) string {
	return timeObj.Format(time.RFC3339)
}
