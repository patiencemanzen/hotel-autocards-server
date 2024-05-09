import { Request, Response } from "express";
import { tryCatch } from "../helpers/general-helpers";
import { Database, IUserModel, Organization, Project, Table, TableColumn } from "../models";

export const merge = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const body = req.body;
        const databaseId = body.databaseId;
        const user = req.user as IUserModel;

        const database = await Database.findOne({ _id: databaseId, deleted: false });
        if (!database) return res.status(404).json({ status: "error", message: "Database not found" });

        const project = await Project.findOne({ _id: database.project, deleted: false });
        if (!project) return res.status(404).json({ status: "error", message: "You do not have permission to this project" });

        const organization = await Organization.findOne({ _id: project.organization, user: user._id });
        if (!organization) return res.status(404).json({ status: "error", message: "Project's organization not found or you do not have permission" });
        
        const databaseStructure = body.databaseStructure;

        for (const structure of databaseStructure) {
            const tableName = structure.tableName;
            const tableId = structure.tableId;
            const tableDefinitions = structure.tableDefinitions;
            const filename = structure.filename;
            const tech_stack = structure.tech_stack;

            const table = (tableId && tableId.trim() !== '' && tableId !== 'null')
                    ? await Table.findOne({ _id: tableId, deleted: false })
                    : await Table.create({ name: tableName, database: database._id, description: "", filename, tech_stack});

            if (!table) continue;

            await TableColumn.deleteMany({ table: table._id });

            await TableColumn.insertMany(tableDefinitions.map((definition: any) => ({ ...definition, table: table._id })));        
        }

        res.status(200).json({ status: "success", message: "File merged successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to merge files" }));
}