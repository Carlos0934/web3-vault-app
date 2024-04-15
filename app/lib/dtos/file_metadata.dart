class FileMetadata {
  final String name;
  final int size;
  final String checksum;
  final String key;
  final int createdAt;

  FileMetadata(
      {required this.name,
      required this.size,
      required this.checksum,
      required this.key,
      required this.createdAt});

  factory FileMetadata.fromJson(Map<String, dynamic> json) {
    return FileMetadata(
      name: json['name'],
      size: json['size'],
      checksum: json['checksum'],
      key: json['key'],
      createdAt: json['timestamp'],
    );
  }
}
