class FileMetadata {
  final String id;
  final String name;
  final int size;
  final String status;
  final int createdAt;

  FileMetadata(
      {required this.id,
      required this.name,
      required this.size,
      required this.status,
      required this.createdAt});

  factory FileMetadata.fromJson(Map<String, dynamic> json) {
    return FileMetadata(
      id: json['id'],
      name: json['name'],
      size: json['size'],
      status: json['status'],
      createdAt: json['createdAt'],
    );
  }
}
