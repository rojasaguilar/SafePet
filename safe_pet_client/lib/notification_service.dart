import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

class NotificationService {
  static final FlutterLocalNotificationsPlugin
  _flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  static Future<void> initNotifications() async {
    tz.initializeTimeZones();
    tz.setLocalLocation(tz.getLocation('America/Mexico_City'));

    const AndroidInitializationSettings initializationSettingsAndroid =
    AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsIOS =
    DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initializationSettings =
    InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );

    await _flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
    );

    const AndroidNotificationChannel channel = AndroidNotificationChannel(
      'birthday_channel_id',
      'Cumpleaños de Mascotas',
      description: 'Notificaciones para recordar los cumpleaños de tus mascotas.',
      importance: Importance.high,
    );

    await _flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);

    await _requestPermissions();
    await _requestExactAlarmPermission();

    print('✅ NotificationService inicializado correctamente');
  }

  static Future<void> _requestPermissions() async {
    final AndroidFlutterLocalNotificationsPlugin? androidImplementation =
    _flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      final bool? granted = await androidImplementation.requestNotificationsPermission();
      print('Permiso de notificaciones: ${granted ?? false}');
    }
  }

  static Future<void> _requestExactAlarmPermission() async {
    final AndroidFlutterLocalNotificationsPlugin? androidImplementation =
    _flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      final bool? granted = await androidImplementation.requestExactAlarmsPermission();
      print('Permiso de alarmas exactas: ${granted ?? false}');
    }
  }

  static Future<void> scheduleBirthdayNotification({
    required int id,
    required String petName,
    required DateTime birthday,
  }) async {
    final now = tz.TZDateTime.now(tz.local);

    var nextBirthday = tz.TZDateTime(
      tz.local,
      now.year,
      birthday.month,
      birthday.day,
      9, // 9 AM
    );

    if (nextBirthday.isBefore(now)) {
      nextBirthday = tz.TZDateTime(
        tz.local,
        now.year + 1,
        birthday.month,
        birthday.day,
        9,
      );
    }

    const AndroidNotificationDetails androidDetails =
    AndroidNotificationDetails(
      'birthday_channel_id',
      'Cumpleaños de Mascotas',
      channelDescription: 'Notificaciones para recordar los cumpleaños de tus mascotas.',
      importance: Importance.high,
      priority: Priority.high,
      ticker: 'ticker',
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails();

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    try {
      await _flutterLocalNotificationsPlugin.zonedSchedule(
        id,
        '🎉 ¡Cumpleaños de $petName!',
        'Hoy es el cumpleaños de tu mascota $petName. ¡Felicidades!',
        nextBirthday,
        notificationDetails,
        uiLocalNotificationDateInterpretation:
        UILocalNotificationDateInterpretation.absoluteTime,
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        matchDateTimeComponents: DateTimeComponents.dayOfMonthAndTime,
      );
      print('✅ Notificación DEMO programada para $petName en 10 segundos: $nextBirthday');
    } catch (e) {
      print('❌ Error al programar notificación: $e');
    }
  }

  static Future<void> cancelNotification(int id) async {
    await _flutterLocalNotificationsPlugin.cancel(id);
    print('🗑️ Notificación $id cancelada');
  }

  static int generateUniqueId(String petId) {
    return petId.hashCode;
  }

  static Future<void> showInstantNotification({
    required int id,
    required String title,
    required String body,
  }) async {
    const AndroidNotificationDetails androidDetails =
    AndroidNotificationDetails(
      'birthday_channel_id',
      'Cumpleaños de Mascotas',
      channelDescription: 'Notificaciones para recordar los cumpleaños de tus mascotas.',
      importance: Importance.high,
      priority: Priority.high,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails();

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _flutterLocalNotificationsPlugin.show(
      id,
      title,
      body,
      notificationDetails,
    );
    print('✅ Notificación inmediata mostrada: $title');
  }

  static Future<void> printPendingNotifications() async {
    final List<PendingNotificationRequest> pendingNotifications =
    await _flutterLocalNotificationsPlugin.pendingNotificationRequests();

    print('📋 Notificaciones pendientes: ${pendingNotifications.length}');
    for (var notification in pendingNotifications) {
      print('   - ID: ${notification.id}, Title: ${notification.title}');
    }
  }

  static Future<void> cancelAllNotifications() async {
    await _flutterLocalNotificationsPlugin.cancelAll();
    print('🗑️ Todas las notificaciones canceladas');
  }
}