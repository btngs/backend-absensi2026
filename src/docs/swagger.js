const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Attendance Backend API',
    version: '1.0.0',
    description: 'Dokumentasi endpoint untuk auth, users, dan attendance.'
  },
  servers: [
    {
      url: '/',
      description: 'Current host'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Autentikasi dan token' },
    { name: 'Users', description: 'Manajemen user' },
    { name: 'Attendance', description: 'Absensi masuk, keluar, dan histori' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      AuthUser: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          phone_number: { type: 'string', example: '081234567890' },
          role: { type: 'string', example: 'karyawan' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'john@example.com' },
          password: { type: 'string', example: 'password123' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'phone_number', 'password'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          phone_number: { type: 'string', example: '081234567890' },
          password: { type: 'string', example: 'password123' }
        }
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email', 'phone_number', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          phone_number: { type: 'string', example: '081234567890' },
          password: { type: 'string', example: 'password123' },
          role: { type: 'string', example: 'karyawan' }
        }
      },
      AttendanceCheckInRequest: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'Hadir', default: 'Hadir' },
          keterangan: { type: 'string', example: 'Masuk kerja seperti biasa', default: '' }
        }
      },
      AuthSuccessResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          accessToken: { type: 'string' },
          user: { '$ref': '#/components/schemas/AuthUser' }
        }
      },
      GenericMessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      UserListResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'success' },
          data: {
            type: 'array',
            items: {
              '$ref': '#/components/schemas/UserItem'
            }
          }
        }
      },
      UserItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          phone_number: { type: 'string', example: '081234567890' },
          role: { type: 'string', example: 'admin' },
          created_at: { type: 'string', example: '2026-08-11T08:00:00.000Z' },
          updated_at: { type: 'string', example: '2026-08-11T08:00:00.000Z' }
        }
      },
      UserResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'success' },
          data: {
            '$ref': '#/components/schemas/UserItem'
          }
        }
      },
      CreateUserResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User created successfully' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' },
              phone_number: { type: 'string', example: '081234567890' },
              role: { type: 'string', example: 'karyawan' }
            }
          }
        }
      },
      AttendanceRecord: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          tanggal: { type: 'string', example: '2026-08-11' },
          jam_masuk: { type: 'string', example: '08:00:00' },
          jam_keluar: { type: 'string', example: '17:00:00' },
          status: { type: 'string', example: 'Hadir' },
          keterangan: { type: 'string', example: 'On site' }
        }
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { '$ref': '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login berhasil',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/AuthSuccessResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'Successfully logged in',
                      accessToken: 'eyJhbGciOi...',
                      user: {
                        id: 1,
                        name: 'John Doe',
                        email: 'john@example.com',
                        phone_number: '081234567890',
                        role: 'karyawan'
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Email atau password tidak valid' }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register user baru',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { '$ref': '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Registrasi berhasil',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/AuthSuccessResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'User registered successfully',
                      accessToken: 'eyJhbGciOi...',
                      user: {
                        id: 2,
                        name: 'Jane Doe',
                        email: 'jane@example.com',
                        phone_number: '081234567891',
                        role: 'karyawan'
                      }
                    }
                  }
                }
              }
            }
          },
          409: { description: 'User sudah ada' }
        }
      }
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Generate access token baru dari refresh token cookie',
        responses: {
          200: {
            description: 'Token baru berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    accessToken: { type: 'string', example: 'eyJhbGciOi...' }
                  }
                },
                examples: {
                  success: {
                    value: {
                      status: 'success',
                      accessToken: 'eyJhbGciOi...'
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Refresh token tidak ditemukan' },
          403: { description: 'Refresh token tidak valid atau kedaluwarsa' }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user',
        responses: {
          200: {
            description: 'Logout berhasil',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/GenericMessageResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'Successfully logged out'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Ambil semua user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Data user berhasil diambil',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/UserListResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'success',
                      data: [
                        {
                          id: 1,
                          name: 'John Doe',
                          email: 'john@example.com',
                          phone_number: '081234567890',
                          role: 'admin'
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Token tidak ada atau tidak valid' },
          403: { description: 'Hanya admin yang bisa akses' }
        }
      }
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Ambil user berdasarkan ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'User ditemukan',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/UserResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'success',
                      data: {
                        id: 1,
                        name: 'John Doe',
                        email: 'john@example.com',
                        phone_number: '081234567890',
                        role: 'karyawan'
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'User tidak ditemukan' }
        }
      }
    },
    '/users/create': {
      post: {
        tags: ['Users'],
        summary: 'Buat user baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { '$ref': '#/components/schemas/CreateUserRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'User berhasil dibuat',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/CreateUserResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'User created successfully',
                      data: {
                        id: 3,
                        name: 'Jane Doe',
                        email: 'jane@example.com',
                        phone_number: '081234567891',
                        role: 'karyawan'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users/update/{id}': {
      put: {
        tags: ['Users'],
        summary: 'Update user',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { '$ref': '#/components/schemas/CreateUserRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'User berhasil diupdate',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/CreateUserResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'User updated successfully',
                      data: {
                        id: 3,
                        name: 'Jane Doe',
                        email: 'jane@example.com',
                        phone_number: '081234567891',
                        role: 'admin'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users/delete/{id}': {
      delete: {
        tags: ['Users'],
        summary: 'Hapus user',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'User berhasil dihapus',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/GenericMessageResponse' },
                examples: {
                  success: {
                    value: {
                      message: 'User deleted successfully'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/attendance/check-in': {
      post: {
        tags: ['Attendance'],
        summary: 'Absen masuk',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: { '$ref': '#/components/schemas/AttendanceCheckInRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Absen masuk berhasil dicatat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Absen masuk berhasil dicatat' },
                    data: { '$ref': '#/components/schemas/AttendanceRecord' }
                  }
                },
                examples: {
                  success: {
                    value: {
                      success: true,
                      message: 'Absen masuk berhasil dicatat',
                      data: {
                        id: 11,
                        user_id: 1,
                        tanggal: '2026-08-11',
                        jam_masuk: '08:01:00',
                        status: 'Hadir',
                        keterangan: 'Masuk kerja seperti biasa'
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Sudah absen masuk hari ini' }
        }
      }
    },
    '/attendance/check-out': {
      patch: {
        tags: ['Attendance'],
        summary: 'Absen keluar',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Absen keluar berhasil dicatat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Absen keluar berhasil dicatat' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 11 },
                        tanggal: { type: 'string', example: '2026-08-11' },
                        jam_masuk: { type: 'string', example: '08:01:00' },
                        jam_keluar: { type: 'string', example: '17:00:00' }
                      }
                    }
                  }
                },
                examples: {
                  success: {
                    value: {
                      success: true,
                      message: 'Absen keluar berhasil dicatat',
                      data: {
                        id: 11,
                        tanggal: '2026-08-11',
                        jam_masuk: '08:01:00',
                        jam_keluar: '17:00:00'
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'Belum absen masuk hari ini' }
        }
      }
    },
    '/attendance/history': {
      get: {
        tags: ['Attendance'],
        summary: 'Riwayat absensi user login',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Riwayat absensi berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Riwayat absensi berhasil diambil' },
                    data: {
                      type: 'array',
                      items: { '$ref': '#/components/schemas/AttendanceRecord' }
                    }
                  }
                },
                examples: {
                  success: {
                    value: {
                      success: true,
                      message: 'Riwayat absensi berhasil diambil',
                      data: [
                        {
                          id: 11,
                          user_id: 1,
                          tanggal: '2026-08-11',
                          jam_masuk: '08:01:00',
                          jam_keluar: '17:00:00',
                          status: 'Hadir',
                          keterangan: 'Masuk kerja seperti biasa'
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/attendance': {
      get: {
        tags: ['Attendance'],
        summary: 'Ambil semua absensi',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Seluruh data absensi berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Seluruh data absensi berhasil diambil' },
                    data: {
                      type: 'array',
                      items: { '$ref': '#/components/schemas/AttendanceRecord' }
                    }
                  }
                },
                examples: {
                  success: {
                    value: {
                      success: true,
                      message: 'Seluruh data absensi berhasil diambil',
                      data: [
                        {
                          id: 11,
                          user_id: 1,
                          tanggal: '2026-08-11',
                          jam_masuk: '08:01:00',
                          jam_keluar: '17:00:00',
                          status: 'Hadir',
                          keterangan: 'Masuk kerja seperti biasa'
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/attendance/{id}': {
      get: {
        tags: ['Attendance'],
        summary: 'Ambil detail absensi berdasarkan ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Detail absensi ditemukan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Detail absensi ditemukan' },
                    data: { '$ref': '#/components/schemas/AttendanceRecord' }
                  }
                },
                examples: {
                  success: {
                    value: {
                      success: true,
                      message: 'Detail absensi ditemukan',
                      data: {
                        id: 11,
                        user_id: 1,
                        tanggal: '2026-08-11',
                        jam_masuk: '08:01:00',
                        jam_keluar: '17:00:00',
                        status: 'Hadir',
                        keterangan: 'Masuk kerja seperti biasa'
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'Data absensi tidak ditemukan' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
