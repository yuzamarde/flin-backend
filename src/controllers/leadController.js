// /backend/controllers/leadController.js

import Lead from "../models/leadModel.js";


// ✅ POST /api/leads - Create a new lead
export const createLead = async (req, res) => {
    try {
        const { name, phone, email, loanType } = req.body;

        // Validasi input
        if (!name || !phone || !email || !loanType) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Cek apakah lead dengan email yang sama sudah ada
        const existingLead = await Lead.findOne({ email });
        if (existingLead) {
            return res.status(409).json({
                message: "Lead with this email already exists",
            });
        }

        // Simpan lead baru
        const lead = await Lead.create({
            name,
            phone,
            email,
            loanType,
        });

        res.status(201).json({
            message: "Lead created successfully",
            lead,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getAllLeads = async (req, res) => {
    try {
        const {
            name,
            loanType,
            page = 1,
            limit = 10
        } = req.query;

        // Setup filter
        const filter = {};

        // Tambahkan filter untuk nama (jika ada)
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }

        // Tambahkan filter untuk tipe pinjaman (jika ada)
        if (loanType) {
            filter.loanType = loanType;
        }

        // Hitung offset untuk pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Ambil data leads dan total count secara bersamaan
        const [total, leads] = await Promise.all([
            Lead.countDocuments(filter),
            Lead.find(filter)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }) // Urutkan berdasarkan tanggal terbaru
        ]);

        return res.status(200).json({
            message: "Leads fetched successfully",
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            leads
        });
    } catch (error) {
        console.error("Error in getAllLeads:", error);
        return res.status(500).json({ message: "Server error", details: error.message });
    }
};
