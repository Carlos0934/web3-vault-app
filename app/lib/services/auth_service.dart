import 'package:http/http.dart';

class AuthService {
  final _http = Client();
  final _baseUrl =
      'https://5csrj3tta5.execute-api.us-east-2.amazonaws.com/prod/api';

  Future<void> login(String email, String password) async {
    final response = await _http.post(
      Uri.parse('$_baseUrl/auth/login'),
      body: {'email': email, 'password': password},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to login');
    }
  }
}
